# backend/utils/llm_explainer.py
import openai
import os
from typing import Dict, Any
from dotenv import load_dotenv
load_dotenv()
class LLMExplainer:
    """Generate friendly explanations using LLM"""
    def __init__(self):
        # Set OpenAI API key
        openai.api_key = os.getenv('OPENAI_API_KEY')
        # Fallback templates if LLM fails
        self.templates = {
            'approved': {
                'base': "Great news! You're pre-approved for solar financing. With an estimated monthly payment of ${monthly_payment}, you'll save ${monthly_savings} per month compared to your current electric bill. Your solar system will pay for itself in just {payback_years} years!",
                'high_savings': "Fantastic! You're pre-approved and your solar savings are impressive. You'll actually save ${monthly_savings} per month from day one, while building equity in your home. This is a no-brainer!",
                'neutral': "Good news! You're pre-approved for solar financing. Your monthly payment of ${monthly_payment} is close to your current bill, but you'll be protected from rising electricity costs and own your power."
            },
            'borderline': {
                'base': "You're on the edge of approval! With a monthly payment of ${monthly_payment}, solar could work for you. Consider a smaller system or improving your credit score by a few points to get better terms.",
                'credit': "You're close! Your energy savings look great, but boosting your credit score just a bit could unlock better rates and lower your payment from ${monthly_payment} to under ${target_payment}.",
                'size': "Almost there! Your current quote is for a {system_size}kW system. Consider starting with a smaller system to lower your monthly payment and still cut your electric bill significantly."
            },
            'not_qualified': {
                'base': "Not quite ready for solar financing today, but don't give up! Your estimated payment of ${monthly_payment} is too high compared to your ${current_bill} electric bill. Here's what could help...",
                'credit': "Solar will be a great option once you improve your credit score. Focus on paying down debts and making on-time payments. Even moving from '{credit_band}' to 'Fair' credit could make solar affordable for you.",
                'bill': "Your electric bill of ${current_bill} might be too low to justify a solar system right now. Solar typically makes sense for bills over $100/month. Consider energy efficiency improvements first."
            }
        }
    def generate_explanation(self, result: Dict[str, Any]) -> str:
        """Generate explanation using OpenAI or fallback templates"""
        try:
            # Try using OpenAI API
            if openai.api_key and openai.api_key != 'your_openai_key_here':
                return self._generate_with_openai(result)
        except Exception as e:
            print(f"LLM generation failed: {str(e)}")
        # Fallback to templates
        return self._generate_from_template(result)
    def _generate_with_openai(self, result: Dict[str, Any]) -> str:
        """Generate explanation using OpenAI"""
        # Calculate monthly savings
        monthly_savings = result['currentBill'] - result['monthlyPayment']
        # Create prompt
        prompt = f"""
        You are a friendly solar advisor. Create a 2-3 sentence explanation for this solar loan pre-qualification result.
        Details:
        - Status: {result['status']} (approved/borderline/not_qualified)
        - Current electric bill: ${result['currentBill']}
        - Estimated solar loan payment: ${result['monthlyPayment']}
        - Monthly savings: ${monthly_savings:.2f}
        - Payback period: {result['paybackYears']} years
        - Credit band: {result['creditBand']}
        - System size: {result['systemSizeKW']}kW
        - 25-year savings: ${result['totalSavings']:,.0f}
        Guidelines:
        - Be encouraging and positive, even for rejections
        - Compare the payment to their current bill
        - Mention the long-term savings if approved
        - For borderline/rejected, give one specific tip to qualify
        - Use simple, conversational language
        - No technical jargon
        Explanation:
        """
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful solar financing advisor who explains complex financial decisions in simple, friendly terms."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    def _generate_from_template(self, result: Dict[str, Any]) -> str:
        """Generate explanation from templates"""
        status = result['status']
        monthly_payment = result['monthlyPayment']
        current_bill = result['currentBill']
        monthly_savings = current_bill - monthly_payment
        payback_years = result['paybackYears']
        # Select template based on status and conditions
        if status == 'approved':
            if monthly_savings > 50:
                template = self.templates['approved']['high_savings']
            elif monthly_savings > 0:
                template = self.templates['approved']['base']
            else:
                template = self.templates['approved']['neutral']
        elif status == 'borderline':
            if result['creditBand'] in ['Fair', 'Poor']:
                template = self.templates['borderline']['credit']
            else:
                template = self.templates['borderline']['base']
        else:  # not_qualified
            if current_bill < 75:
                template = self.templates['not_qualified']['bill']
            elif result['creditBand'] == 'Poor':
                template = self.templates['not_qualified']['credit']
            else:
                template = self.templates['not_qualified']['base']
        # Fill in the template
        explanation = template.format(
            monthly_payment=f"{monthly_payment:.0f}",
            current_bill=f"{current_bill:.0f}",
            monthly_savings=f"{abs(monthly_savings):.0f}",
            payback_years=f"{payback_years:.1f}",
            system_size=f"{result['systemSizeKW']:.1f}",
            credit_band=result['creditBand'],
            target_payment=f"{current_bill * 0.9:.0f}"
        )
        return explanation
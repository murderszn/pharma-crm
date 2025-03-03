import { geminiApi } from './geminiApi';

export const rfpApi = {
  generateSection: async (section, requirements) => {
    try {
      const prompt = `As an expert RFP response writer, help me create a professional and detailed ${section.name} section for an RFP response.

RFP Requirements:
${requirements}

Section Requirements:
${section.prompt}

Please generate a detailed and compelling ${section.name} section for this RFP response.
Use professional RFP writing best practices, focusing on:
- Clear and concise language
- Specific, measurable details
- Evidence-based statements
- Professional formatting
- Addressing all requirements directly
- Including relevant metrics and examples
- Following industry best practices

Format the response with appropriate headings, bullet points, and professional structure.`;

      const response = await geminiApi.generateText(prompt);
      return response.message;
    } catch (error) {
      console.error('Error in RFP API:', error);
      throw error;
    }
  }
}; 
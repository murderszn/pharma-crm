import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export async function writeGrant(grant) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
        Write a professional grant proposal for the following grant opportunity:
        
        Title: ${grant.title}
        Description: ${grant.description}
        Amount: ${grant.analysis?.grantAmount?.max || 'Not specified'}
        Deadline: ${grant.analysis?.timeRelevance?.deadline || 'Not specified'}
        
        Please include:
        1. Executive Summary
        2. Organization Background
        3. Project Description
        4. Goals and Objectives
        5. Budget Overview
        6. Timeline
        7. Evaluation Plan
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            proposal: text,
            message: 'Grant proposal generated successfully'
        };
    } catch (error) {
        console.error('Error generating grant proposal:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to generate grant proposal'
        };
    }
}

const sendProposalEmail = async (proposalText, grantData) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: `Grant Proposal Draft: ${grantData.title}`,
        content: proposalText,
        attachments: [{
          filename: 'grant_proposal.docx',
          content: proposalText
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 
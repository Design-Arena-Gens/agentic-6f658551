import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { emailBody, emailSubject, template, customInstructions } = await request.json();

    // Template-based reply generation
    const templatePrompts: Record<string, string> = {
      professional: 'Write a professional and courteous email reply.',
      friendly: 'Write a warm and friendly email reply.',
      brief: 'Write a brief and concise email reply.',
      detailed: 'Write a detailed and comprehensive email reply.',
    };

    const basePrompt = templatePrompts[template] || templatePrompts.professional;

    // Simulated AI reply generation (rule-based for demo)
    const reply = generateSimulatedReply(emailBody, emailSubject, basePrompt, customInstructions);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    );
  }
}

function generateSimulatedReply(
  emailBody: string,
  emailSubject: string,
  template: string,
  customInstructions: string
): string {
  const greeting = 'Dear Sender,\n\n';
  const closing = '\n\nBest regards,\nAuto Reply System';

  // Detect keywords and generate contextual replies
  const lowerBody = emailBody.toLowerCase();
  const lowerSubject = emailSubject.toLowerCase();

  let response = '';

  if (lowerBody.includes('meeting') || lowerSubject.includes('meeting') || lowerBody.includes('schedule')) {
    response = 'Thank you for reaching out regarding scheduling a meeting. I would be happy to discuss this with you. Please let me know your available time slots, and I will do my best to accommodate your schedule.';
  } else if (lowerBody.includes('update') || lowerBody.includes('status') || lowerSubject.includes('update')) {
    response = 'Thank you for your inquiry about the project status. I appreciate your interest in staying informed. I will gather the latest information and provide you with a comprehensive update shortly.';
  } else if (lowerBody.includes('question') || lowerBody.includes('help') || lowerBody.includes('pricing')) {
    response = 'Thank you for your question. I would be glad to help you with this. Let me look into the details and get back to you with accurate information as soon as possible.';
  } else if (lowerBody.includes('proposal') || lowerSubject.includes('proposal')) {
    response = 'Thank you for your interest in our proposal. I appreciate you taking the time to review it. I would be happy to discuss any aspects of the proposal in more detail and answer any questions you may have.';
  } else if (lowerBody.includes('support') || lowerBody.includes('issue') || lowerBody.includes('problem')) {
    response = 'Thank you for contacting support. I understand you are experiencing an issue, and I want to help resolve it as quickly as possible. Could you please provide more details about the problem so I can assist you better?';
  } else {
    response = 'Thank you for your email. I have received your message and will review it carefully. I will get back to you with a detailed response as soon as possible.';
  }

  // Apply template style
  if (template.includes('brief') || template.includes('Brief')) {
    response = response.split('.')[0] + '. I will follow up soon.';
  } else if (template.includes('friendly') || template.includes('Friendly')) {
    response = response.replace('Thank you for', 'Thanks so much for');
    response = response.replace('I would be', "I'd be");
    response += ' Looking forward to connecting with you!';
  } else if (template.includes('detailed') || template.includes('Detailed')) {
    response += '\n\nIn the meantime, if you have any additional information or specific requirements you would like to share, please feel free to include them in your response. This will help me provide you with the most accurate and helpful information possible.';
  }

  // Add custom instructions context if provided
  if (customInstructions && customInstructions.trim()) {
    response += `\n\nNote: ${customInstructions}`;
  }

  return greeting + response + closing;
}

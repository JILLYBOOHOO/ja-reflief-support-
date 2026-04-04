import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  constructor() {}

  async getResponse(message: string): Promise<string> {
    const input = message.toLowerCase();
    
    // Formal English responses
    if (input.includes('wa gwan') || input.includes('yo') || input.includes('hello') || input.includes('hi')) {
      return "Hello! I am JA-Z, your Relief Assistant. How can I help you today with your disaster relief needs?";
    }
    
    if (input.includes('how can i help') || input.includes('donate')) {
      return "Thank you for your generosity! You can make a monetary or in-kind donation on our Donate page. Simply click 'Donate' in the navigation menu above to get started.";
    }

    if (input.includes('food') || input.includes('starve') || input.includes('aid') || input.includes('water')) {
      return "We are here to help. Please register on our platform and specify your damage level (Low, Medium, or High). Relief teams are currently distributing food and water based on these priority levels.";
    }

    if (input.includes('wifi') || input.includes('internet') || input.includes('voucher')) {
      return "For emergency connectivity, please click the 'Get WIFI' button on our home page. You can use the voucher code JA-RELIEF-1234 to connect at any of our authorized hotspots.";
    }

    if (input.includes('danger') || input.includes('flood') || input.includes('landslide')) {
      return "Safety is our priority. Please use the 'Report Danger Zone' button on the Information or Donate page to alert us of flooding or landslides. Please stay clear of these areas for your own safety.";
    }

    if (input.includes('thank') || input.includes('bless') || input.includes('thanks')) {
      return "You are very welcome! We are in this together. Is there anything else I can assist you with today?";
    }

    if (input.includes('where') || input.includes('location') || input.includes('center')) {
        return "We have active relief centers in Kingston, Montego Bay, Mandeville, and St. Ann. You can find detailed maps and physical addresses on our Information page.";
    }

    // Default formal response
    return "I am sorry, I didn't quite catch that. JA Relief is here to support you. Would you like to know more about requesting food aid, finding WiFi, or how to make a donation?";
  }
}

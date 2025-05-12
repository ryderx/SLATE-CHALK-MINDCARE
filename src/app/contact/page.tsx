// Required for form handling with useActionState or client-side interactions
'use client'; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import { useActionState, useEffect } from "react"; // Changed from 'react-dom' and added useEffect
import { useToast } from '@/hooks/use-toast';
import Image from "next/image";

// Mock server action for contact form
async function submitContactForm(prevState: any, formData: FormData) {
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000));
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  console.log('Contact Form Submitted:', { name, email, message });

  // Basic validation example
  if (!name || !email || !message) {
    return { success: false, message: 'Please fill in all fields.' };
  }
  if (typeof email === 'string' && !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  return { success: true, message: 'Thank you for your message! We will get back to you soon.' };
}

const initialFormState = { success: false, message: '' };

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContactForm, initialFormState); // Changed from useFormState
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Message Sent!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        // Optionally reset form here if using controlled components,
        // or rely on browser reset for basic forms.
        // For this simple form, a page refresh or navigating away would clear it.
        // Consider document.getElementById('contact-form').reset() if form has an id
      }
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary mb-4">Get In Touch</h1>
        <p className="text-xl text-foreground max-w-2xl mx-auto">
          We're here to help. Reach out to us with any questions or to schedule an appointment.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6" id="contact-form"> {/* Added id for potential reset */}
              <div>
                <Label htmlFor="name" className="font-medium">Full Name</Label>
                <Input type="text" id="name" name="name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="font-medium">Email Address</Label>
                <Input type="email" id="email" name="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message" className="font-medium">Message</Label>
                <Textarea id="message" name="message" rows={5} required className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-accent mr-3 shrink-0" />
                <p className="text-foreground">123 Wellness Lane, Mindful City, ST 12345</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-accent mr-3 shrink-0" />
                <p className="text-foreground">(123) 456-7890</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-accent mr-3 shrink-0" />
                <p className="text-foreground">info@slatenchalkmindcare.com</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image 
              src="https://picsum.photos/seed/map/600/350" 
              alt="Colorful illustrated map location" 
              width={600} 
              height={350} 
              className="w-full h-auto object-cover"
              data-ai-hint="colorful map"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


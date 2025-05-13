// Required for form handling with useActionState or client-side interactions
'use client'; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import { useActionState, useEffect, useRef } from "react"; 
import { useToast } from '@/hooks/use-toast';
import Image from "next/image";
import type { ContactFormState } from './actions'; // Import the state type
import { sendContactEmailAction } from './actions'; // Import the server action

const initialFormState: ContactFormState = { success: false, message: '' };

export default function ContactPage() {
  const [state, formAction] = useActionState(sendContactEmailAction, initialFormState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null); // Ref for resetting the form

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Message Sent!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success && formRef.current) {
        formRef.current.reset(); // Reset the form on success
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
            <form ref={formRef} action={formAction} className="space-y-6" id="contact-form">
              <div>
                <Label htmlFor="name" className="font-medium">Full Name</Label>
                <Input type="text" id="name" name="name" required className="mt-1" />
                {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="font-medium">Email Address</Label>
                <Input type="email" id="email" name="email" required className="mt-1" />
                {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email.join(', ')}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="font-medium">Message</Label>
                <Textarea id="message" name="message" rows={5} required className="mt-1" />
                {state.errors?.message && <p className="text-sm text-destructive mt-1">{state.errors.message.join(', ')}</p>}
              </div>
              {state.errors?.general && <p className="text-sm text-destructive mt-1">{state.errors.general.join(', ')}</p>}
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

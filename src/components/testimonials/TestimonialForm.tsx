
'use client';

import type { Testimonial } from '@/lib/types';
import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { TestimonialFormState } from '@/app/admin/testimonials/actions';
import { Star, Link as LinkIcon } from 'lucide-react'; // Added LinkIcon
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  action: (prevState: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
  submitButtonText?: string;
}

const initialFormState: TestimonialFormState = {
  message: '',
  success: false,
};

export function TestimonialForm({ testimonial, action, submitButtonText = 'Submit' }: TestimonialFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
        if (state.success) {
             toast({
               title: "Success!",
               description: state.message,
               variant: "default",
             });
             // Redirect after success toast is shown
             router.push('/admin/testimonials');
             router.refresh(); // Ensure the list page updates
        } else if (!state.success && (state.errors || state.message)) {
             toast({
               title: "Error",
               description: state.message || "An error occurred. Please check the form.",
               variant: "destructive",
             });
        }
    }
  }, [state, toast, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6" id="testimonial-form">
       {/* Display general error message */}
       {state.errors?.general && (
        <p className="text-sm text-destructive mt-1">{state.errors.general.join(', ')}</p>
      )}

      <div>
        <Label htmlFor="quote" className="text-lg font-medium">Quote</Label>
        <Textarea
          id="quote"
          name="quote"
          defaultValue={testimonial?.quote}
          required
          rows={5}
          className="mt-1"
          aria-describedby="quote-error"
        />
        {state.errors?.quote && (
          <p id="quote-error" className="text-sm text-destructive mt-1">
            {state.errors.quote.join(', ')}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="name" className="text-lg font-medium">Client Name / Initials</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={testimonial?.name}
          required
          className="mt-1"
          aria-describedby="name-error"
        />
        {state.errors?.name && (
          <p id="name-error" className="text-sm text-destructive mt-1">
            {state.errors.name.join(', ')}
          </p>
        )}
      </div>

      <div>
        <Label className="text-lg font-medium mb-2 block">Rating (Stars)</Label>
         <RadioGroup
            name="stars"
            defaultValue={testimonial?.stars?.toString() ?? '5'} // Default to 5 stars if not set
            className="flex space-x-2"
            aria-describedby="stars-error"
          >
           {[1, 2, 3, 4, 5].map(value => (
             <div key={value} className="flex items-center space-x-1">
                <RadioGroupItem value={value.toString()} id={`stars-${value}`} />
                <Label htmlFor={`stars-${value}`} className="cursor-pointer flex">
                    {[...Array(value)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[...Array(5 - value)].map((_, i) => (
                         <Star key={i+value} className="h-5 w-5 text-muted-foreground" />
                    ))}
                </Label>
             </div>
           ))}
          </RadioGroup>
          {state.errors?.stars && (
            <p id="stars-error" className="text-sm text-destructive mt-1">
                {state.errors.stars.join(', ')}
            </p>
           )}
      </div>

      <div>
        <Label htmlFor="url" className="text-lg font-medium">Website URL (Optional)</Label>
        <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="url"
              name="url"
              type="url"
              defaultValue={testimonial?.url}
              placeholder="https://example.com"
              className="pl-10" // Add padding to make space for the icon
              aria-describedby="url-error"
            />
        </div>
        {state.errors?.url && (
          <p id="url-error" className="text-sm text-destructive mt-1">
            {state.errors.url.join(', ')}
          </p>
        )}
         <p className="text-xs text-muted-foreground mt-1">
          Provide a link to the client's website or relevant page if applicable.
        </p>
      </div>
      
      {/* ImageHint input removed based on schema in actions.ts being optional and nullable, and not present in the form fields previously */}

      <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
        {submitButtonText}
      </Button>
    </form>
  );
}

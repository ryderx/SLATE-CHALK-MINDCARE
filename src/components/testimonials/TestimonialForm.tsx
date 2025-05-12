
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
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
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
        <Label htmlFor="imageHint" className="text-lg font-medium">Image Hint (Optional)</Label>
        <Input
          id="imageHint"
          name="imageHint"
          type="text"
          defaultValue={testimonial?.imageHint ?? ''}
          className="mt-1"
          aria-describedby="imageHint-error"
           placeholder="e.g., happy person, calm nature"
        />
         <p className="text-xs text-muted-foreground mt-1">A short description for finding a suitable placeholder image.</p>
        {state.errors?.imageHint && (
          <p id="imageHint-error" className="text-sm text-destructive mt-1">
            {state.errors.imageHint.join(', ')}
          </p>
        )}
      </div>

      <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
        {submitButtonText}
      </Button>
    </form>
  );
}

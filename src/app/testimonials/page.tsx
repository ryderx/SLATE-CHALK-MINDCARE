import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, UserCircle } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "Slate & Chalk MindCare transformed my perspective on life. Their compassionate approach made all the difference.",
    name: "A. N.",
    stars: 5,
    imageHint: "happy person",
  },
  {
    quote: "I felt truly heard and understood. The therapists are incredibly skilled and supportive. Highly recommend!",
    name: "J. B.",
    stars: 5,
    imageHint: "thoughtful individual",
  },
  {
    quote: "The couples counseling sessions helped us rebuild our communication and strengthen our bond. We are so grateful.",
    name: "M. & K. S.",
    stars: 5,
    imageHint: "content couple",
  },
  {
    quote: "A safe and professional environment. I've learned so much about myself and developed effective coping strategies.",
    name: "L. P.",
    stars: 4,
    imageHint: "calm nature",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary mb-4">What Our Clients Say</h1>
        <p className="text-xl text-foreground max-w-2xl mx-auto">
          Hear from individuals who have experienced positive change and growth through our services.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="flex flex-col shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-4">
               <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <CardTitle className="text-2xl font-normal text-foreground leading-relaxed italic">
                "{testimonial.quote}"
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Optional: Image related to testimonial theme */}
              {/* <Image src={`https://picsum.photos/seed/testimonial${index}/400/200`} alt={testimonial.imageHint} width={400} height={200} className="rounded-md mt-4" data-ai-hint={testimonial.imageHint} /> */}
            </CardContent>
            <CardFooter className="mt-auto pt-4 border-t">
              <div className="flex items-center">
                <UserCircle className="h-10 w-10 text-primary mr-3" />
                <div>
                  <p className="font-semibold text-primary text-lg">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">Valued Client</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

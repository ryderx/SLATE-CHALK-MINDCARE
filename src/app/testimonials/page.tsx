
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, UserCircle, Pencil, Trash2, PlusCircle } from "lucide-react";
import { getTestimonials } from "@/lib/testimonials-data"; // Fetch data dynamically
import { isAdminSession } from "@/lib/auth-utils"; // Check admin status
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteTestimonialButton } from "@/components/testimonials/DeleteTestimonialButton"; // Import delete button

// Make the page dynamic to fetch fresh data and check auth status on each request
export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const userIsAdmin = await isAdminSession();

  return (
    <div className="container mx-auto py-12 md:py-20">
      <section className="text-center mb-16">
        <div className="flex justify-center items-center mb-4 relative">
             <h1 className="text-5xl font-bold text-primary">What Our Clients Say</h1>
             {/* Admin Add Button */}
            {userIsAdmin && (
                 <Button asChild size="sm" className="absolute right-0 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground ml-4">
                   <Link href="/admin/testimonials/new">
                     <PlusCircle className="mr-2 h-4 w-4" /> Add New
                   </Link>
                 </Button>
            )}
        </div>
        <p className="text-xl text-foreground max-w-2xl mx-auto">
          Hear from individuals who have experienced positive change and growth through our services.
        </p>
      </section>

      {testimonials.length === 0 ? (
         <p className="text-lg text-foreground text-center py-10">No testimonials yet. Check back soon!</p>
      ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="flex flex-col shadow-xl hover:shadow-2xl transition-shadow relative group"> {/* Added group for hover effects */}
                 {/* Admin Edit/Delete Buttons */}
                {userIsAdmin && (
                    <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                         <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/testimonials/${testimonial.id}/edit`} title="Edit Testimonial">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Link>
                         </Button>
                         <DeleteTestimonialButton testimonialId={testimonial.id} testimonialName={testimonial.name}/>
                    </div>
                )}

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
                </CardContent>
                <CardFooter className="mt-auto pt-4 border-t">
                  <div className="flex items-center">
                    {/* Use a generic icon or a placeholder user image */}
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
      )}
    </div>
  );
}


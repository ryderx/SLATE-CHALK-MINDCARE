import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Heart, Smile } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Individual Therapy",
    description: "Personalized one-on-one sessions to address a wide range of mental health concerns, including anxiety, depression, trauma, and stress management.",
    imgSrc: "https://picsum.photos/seed/service1/600/400",
    aiHint: "kids learning",
  },
  {
    icon: Users,
    title: "Couples Counseling",
    description: "Support for couples seeking to improve communication, resolve conflicts, and strengthen their relationship in a constructive environment.",
    imgSrc: "https://picsum.photos/seed/service2/600/400",
    aiHint: "children sharing",
  },
  {
    icon: Heart,
    title: "Family Therapy",
    description: "Guidance for families to navigate challenges, improve dynamics, and foster healthier relationships among members.",
    imgSrc: "https://picsum.photos/seed/service3/600/400",
    aiHint: "happy family drawing",
  },
  {
    icon: Smile,
    title: "Child & Adolescent Counseling",
    description: "Specialized therapy for children and teenagers dealing with emotional, behavioral, or developmental issues, provided in an age-appropriate manner.",
    imgSrc: "https://picsum.photos/seed/service4/600/400",
    aiHint: "child with toys",
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary mb-4">Our Services</h1>
        <p className="text-xl text-foreground max-w-3xl mx-auto">
          We offer a comprehensive range of psychological services tailored to meet your unique needs and support your journey towards mental wellness.
        </p>
      </section>

      <section className="grid md:grid-cols-1 gap-12">
        {services.map((service, index) => (
          <Card key={service.title} className={`flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}>
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <Image
                src={service.imgSrc}
                alt={service.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={service.aiHint}
              />
            </div>
            <div className="md:w-1/2">
              <CardHeader>
                <div className="flex items-center mb-3">
                  <service.icon className="h-10 w-10 text-primary mr-4" />
                  <CardTitle className="text-3xl text-primary">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Ready to Find the Right Support?</h2>
        <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
          Contact us today to discuss your needs and find out how our services can help you or your loved ones.
        </p>
        <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-accent-foreground bg-accent hover:bg-accent/90">
          Schedule a Consultation
        </a>
      </section>
    </div>
  );
}

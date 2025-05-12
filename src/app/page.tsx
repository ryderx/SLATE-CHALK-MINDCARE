import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brain, Users, MessageSquareHeart } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-5rem)] flex items-center justify-center text-center bg-secondary/30">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Calm therapy session background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-30"
          data-ai-hint="calm therapy"
          priority
        />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
            Nurturing Minds, <br />Fostering Well-being
          </h1>
          <p className="text-lg md:text-xl text-foreground mb-8 max-w-2xl mx-auto">
            Slate & Chalk MindCare offers expert psychological care and counseling services designed to support your mental health journey.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/services">Explore Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/contact">Book a Session</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Our Approach to Mental Wellness</h2>
          <p className="text-lg text-foreground max-w-3xl mx-auto mb-12">
            At Slate & Chalk MindCare, we believe in a compassionate, evidence-based approach to mental health. We tailor our therapies to meet your unique needs, fostering a safe and supportive environment for growth and healing.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary">Personalized Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every individual is unique. We create personalized treatment plans that address your specific concerns and goals.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary">Expert Therapists</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our team consists of highly qualified and experienced psychologists and counselors dedicated to your well-being.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <MessageSquareHeart className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary">Supportive Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We provide a safe, confidential, and non-judgmental space for you to explore your thoughts and feelings.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Services Overview Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="md:flex items-center gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image 
                src="https://picsum.photos/600/400?grayscale" 
                alt="Supportive counseling session" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl"
                data-ai-hint="mental wellness" 
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-primary mb-6">Comprehensive Services</h2>
              <p className="text-lg text-foreground mb-8">
                We offer a range of services to support your mental health, including individual therapy, couples counseling, family therapy, and specialized workshops. Our goal is to equip you with the tools and insights needed for lasting positive change.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/services">Learn More About Our Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-foreground max-w-xl mx-auto mb-8">
            Take the first step towards a healthier, more fulfilling life. Reach out to us today to schedule a consultation.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/contact">Contact Us Now <MessageSquareHeart className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}

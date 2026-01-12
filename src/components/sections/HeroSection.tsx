import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export const HeroSection = ({ scrollToSection }: HeroSectionProps) => {
  return (
    <section id="home" className="pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Путь к восстановлению через{' '}
              <span className="text-primary">самоисцеление</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Авторская методика, которая помогает активировать внутренние ресурсы организма
              для естественного восстановления и оздоровления
            </p>
            <Button
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="text-lg px-8 py-6 rounded-full"
            >
              Записаться на консультацию
            </Button>
          </div>
          <div className="animate-fade-in">
            <img
              src="https://cdn.poehali.dev/projects/d0bc2123-3872-4c4a-a615-6b9d6d2f2e53/files/873932fa-0263-48ef-b8fb-64c5d78324a6.jpg"
              alt="Пространство для исцеления"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { HeroSection } from '@/components/sections/HeroSection';
import { MethodAndProcess } from '@/components/sections/MethodAndProcess';
import { ResultsAndTestimonials } from '@/components/sections/ResultsAndTestimonials';
import { ContactSection } from '@/components/sections/ContactSection';

const Index = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/20 to-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Методика исцеления</h1>
            <div className="hidden md:flex gap-8 items-center">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <Icon name="User" className="mr-2" size={18} />
                Личный кабинет
              </Button>
              {['home', 'method', 'process', 'results', 'testimonials', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-foreground hover:text-primary transition-colors duration-300"
                >
                  {section === 'home' && 'Главная'}
                  {section === 'method' && 'Методика'}
                  {section === 'process' && 'Процесс'}
                  {section === 'results' && 'Результаты'}
                  {section === 'testimonials' && 'Отзывы'}
                  {section === 'contact' && 'Контакты'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <HeroSection scrollToSection={scrollToSection} />
      <MethodAndProcess />
      <ResultsAndTestimonials />
      <ContactSection />

      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            © 2024 Методика восстановления и самоисцеления. Все права защищены.
          </p>
          <div className="flex justify-center gap-6">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Instagram" size={24} />
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Facebook" size={24} />
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Youtube" size={24} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

export const ResultsAndTestimonials = () => {
  return (
    <>
      <section id="results" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Результаты клиентов</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Средние показатели улучшения за 3 месяца работы
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Уровень энергии', value: 85, icon: 'Zap' },
              { label: 'Эмоциональное состояние', value: 78, icon: 'Smile' },
              { label: 'Качество сна', value: 90, icon: 'Moon' },
              { label: 'Общее самочувствие', value: 82, icon: 'Heart' },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-none shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl">{item.label}</CardTitle>
                    <Icon name={item.icon} className="text-primary" size={28} />
                  </div>
                  <Progress value={item.value} className="h-3" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{item.value}%</p>
                  <p className="text-sm text-muted-foreground">улучшение показателей</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Отзывы клиентов</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Анна М.',
                text: 'После трёх месяцев работы я наконец-то чувствую себя живой. Энергия вернулась, сон наладился, и я снова радуюсь жизни.',
                rating: 5,
              },
              {
                name: 'Дмитрий К.',
                text: 'Методика помогла мне разобраться с хроническими болями, которые мучили меня годами. Благодарен за профессионализм.',
                rating: 5,
              },
              {
                name: 'Елена В.',
                text: 'Удивительно, как быстро начались изменения. Уже через месяц я заметила значительные улучшения в общем самочувствии.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-none shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" className="fill-primary text-primary" size={20} />
                    ))}
                  </div>
                  <CardTitle className="text-lg font-medium">{testimonial.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

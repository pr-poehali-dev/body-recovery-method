import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const MethodAndProcess = () => {
  return (
    <>
      <section id="method" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Авторская методика</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Целостный подход к восстановлению организма на всех уровнях
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Brain',
                title: 'Интеллектуальный рост',
                description: 'Развитие мышления, расширение сознания и когнитивных способностей',
              },
              {
                icon: 'Heart',
                title: 'Духовный рост',
                description: 'Раскрытие себя и достижение гармонии через законы и энергии Творения мира',
              },
              {
                icon: 'Sparkles',
                title: 'Физическое тело',
                description: 'Активация естественных механизмов самовосстановления организма',
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name={item.icon} className="text-primary" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                  <p className="text-muted-foreground pt-2">{item.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Процесс работы</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Пошаговая система восстановления здоровья
          </p>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Первичная диагностика',
                description: 'Глубокий анализ текущего состояния и выявление корневых причин',
                duration: '1-2 сессии',
              },
              {
                step: '2',
                title: 'Индивидуальный план',
                description: 'Разработка персональной программы восстановления',
                duration: '1 сессия',
              },
              {
                step: '3',
                title: 'Активная работа',
                description: 'Регулярные сеансы и практики для активации механизмов исцеления',
                duration: '2-3 месяца',
              },
              {
                step: '4',
                title: 'Закрепление результата',
                description: 'Интеграция изменений и поддержка достигнутого',
                duration: 'Постоянно',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 items-start animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-sm text-primary font-medium">{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
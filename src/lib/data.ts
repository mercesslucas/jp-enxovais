import { Product } from '@/store/useCartStore';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    category: 'cama',
    name: 'Jogo de Lençol 400 Fios Egípcio Premium',
    description: 'Lençol macio e durável para noites perfeitas. Feito com o mais puro algodão egípcio para garantir durabilidade e maciez em um único produto.',
    composition: '100% Algodão',
    videoUrl: 'https://cdn.pixabay.com/video/2021/08/11/84708-586791932_tiny.mp4',
    variations: [
      { color: 'branco', colorCode: '#ffffff', image: 'https://images.unsplash.com/photo-1629949009765-4dce548f020c?auto=format&fit=crop&q=80&w=600' },
      { color: 'cinza', colorCode: '#808080', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee261ca?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: '2',
    category: 'banho',
    name: 'Toalha de Banho Banhão Fio Penteado',
    description: 'Toalha ultra absorvente e macia. Com sua gramatura superior, ela enxuga o corpo rapidamente com toque de pelúcia.',
    composition: '100% Algodão',
    variations: [
      { color: 'azul sereno', colorCode: '#E3F2FD', image: 'https://images.unsplash.com/photo-1616627581519-798836ce22b2?auto=format&fit=crop&q=80&w=600' },
      { color: 'coral', colorCode: '#F27474', image: 'https://images.unsplash.com/photo-1584063851086-5d4c82c66cb1?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: '3',
    category: 'mesa',
    name: 'Toalha de Mesa Jacquard Retangular',
    description: 'Toalha elegante para 6 lugares. Desenhada no mais fino jacquard, ela fornece um brilho acetinado incrível à sua mesa posta.',
    composition: '50% Algodão 50% Poliéster',
    variations: [
      { color: 'offwhite', colorCode: '#F8F9FA', image: 'https://images.unsplash.com/photo-1617804533031-6430d45a901f?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: '4',
    category: 'cama',
    name: 'Kit Edredom Queen Dupla Face',
    description: 'Kit edredom macio ideal para climas frios. Enchimento antialérgico, mantendo o corpo totalmente abraçado no aconchego.',
    composition: '100% Poliéster Microfibra',
    videoUrl: 'https://cdn.pixabay.com/video/2021/08/11/84708-586791932_tiny.mp4',
    variations: [
      { color: 'azul marinho', colorCode: '#000080', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600' },
      { color: 'rosê', colorCode: '#ffc0cb', image: 'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: '5',
    category: 'banho',
    name: 'Jogo de Toalhas 5 Peças Aveludadas',
    description: 'Conjunto completo de toalhas premium. Possui detalhe em viscose nas barras e veludo em uma das faces para extrema delicadeza.',
    composition: '100% Algodão Egípcio',
    variations: [
      { color: 'verde água', colorCode: '#66CDAA', image: 'https://images.unsplash.com/photo-1603513492128-ba7fc9e311aa?auto=format&fit=crop&q=80&w=600' },
      { color: 'palha', colorCode: '#f3e5ab', image: 'https://images.unsplash.com/photo-1583344607771-419b4b005e83?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: '6',
    category: 'mesa',
    name: 'Jogo Americano 4 Lugares Linho Puno',
    description: 'Charme rústico e sofisticado. A moldura perfeita para seus pratos nas refeições com a família.',
    composition: '100% Linho',
    variations: [
      { color: 'natural', colorCode: '#E3DAC9', image: 'https://images.unsplash.com/photo-1582283084976-591fb46973e6?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: '7',
    category: 'cama',
    name: 'Travesseiro Cervical Viscoelástico',
    description: 'Ergonomia perfeita para a sua cervical. Adequa-se ao formato do seu ombro permitindo relaxamento muscular absoluto.',
    composition: '100% Viscoelástico',
    variations: [
      { color: 'branco', colorCode: '#ffffff', image: 'https://images.unsplash.com/photo-1594628205214-a90234bd254a?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: '8',
    category: 'banho',
    name: 'Roupão Microfibra Plush Conforto',
    description: 'Aquecimento e fofura para o pós-banho. Perfeito para o inverno.',
    composition: '100% Poliéster',
    variations: [
      { color: 'grafite', colorCode: '#343a40', image: 'https://images.unsplash.com/photo-1590845947376-24ba0da2b0b1?auto=format&fit=crop&q=80&w=600' },
      { color: 'bege', colorCode: '#F5F5DC', image: 'https://images.unsplash.com/photo-1522771930-78848d5287f3?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: '9',
    category: 'decoração',
    name: 'Manta Decorativa Sofá / Cama',
    description: 'Manta em tricot para embelezar ambientes. Ideal para noites de filmes e vinhos.',
    composition: '100% Acrílico',
    variations: [
      { color: 'mostarda', colorCode: '#FFDB58', image: 'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?auto=format&fit=crop&q=80&w=600' },
      { color: 'cru', colorCode: '#EADDCA', image: 'https://images.unsplash.com/photo-1585800455426-ed933224bbae?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: '10',
    category: 'mesa',
    name: 'Capa de Sousplat Jacquard Requinte',
    description: 'Renove as cores da sua mesa posta com nossas capas ajustáveis.',
    composition: 'Algodão com Poliéster',
    variations: [
      { color: 'vermelho', colorCode: '#FF0000', image: 'https://images.unsplash.com/photo-1574087611099-2a9c3b88b03e?auto=format&fit=crop&q=80&w=600' },
      { color: 'verde oliva', colorCode: '#808000', image: 'https://images.unsplash.com/photo-1579450841203-317ec1acba0a?auto=format&fit=crop&q=80&w=600' }
    ]
  }
];

import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

// Здесь добавь свои ссылки на картинки
const CARD_IMAGES = [
  'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=1', // Замени на свою картинку
  'https://via.placeholder.com/100/4ECDC4/FFFFFF?text=2', // Замени на свою картинку
  'https://via.placeholder.com/100/45B7D1/FFFFFF?text=3', // Замени на свою картинку
  'https://via.placeholder.com/100/FFA07A/FFFFFF?text=4', // Замени на свою картинку
  'https://via.placeholder.com/100/98D8C8/FFFFFF?text=5', // Замени на свою картинку
  'https://via.placeholder.com/100/F7DC6F/FFFFFF?text=6', // Замени на свою картинку
  'https://via.placeholder.com/100/BB8FCE/FFFFFF?text=7', // Замени на свою картинку
];

const DIFFICULTY = {
  easy: { pairs: 5, label: 'Легкий' },
  medium: { pairs: 6, label: 'Средний' },
  hard: { pairs: 7, label: 'Сложный' }
};

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Таймер
  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  // Проверка победы
  useEffect(() => {
    if (solved.length > 0 && solved.length === cards.length) {
      setGameWon(true);
      setGameStarted(false);
    }
  }, [solved, cards]);

  const initGame = (level) => {
    const pairCount = DIFFICULTY[level].pairs;
    const selectedImages = CARD_IMAGES.slice(0, pairCount);
    const gameCards = [...selectedImages, ...selectedImages]
      .map((image, index) => ({
        id: index,
        image,
        pairId: image
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setTime(0);
    setGameWon(false);
    setDifficulty(level);
    setGameStarted(true);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = newFlipped;
      if (cards[first].pairId === cards[second].pairId) {
        setSolved([...solved, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setDifficulty(null);
    setCards([]);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameWon(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">🎮 Найди пару</h1>
          <p className="text-center text-gray-600 mb-8">Выбери уровень сложности</p>
          
          <div className="space-y-4">
            {Object.entries(DIFFICULTY).map(([key, value]) => (
              <button
                key={key}
                onClick={() => initGame(key)}
                className="w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-lg"
                style={{
                  background: key === 'easy' ? '#4ADE80' : key === 'medium' ? '#FBBF24' : '#F87171',
                  color: 'white'
                }}
              >
                {value.label} - {value.pairs} пар
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Поздравляем!</h2>
          <p className="text-xl mb-6 text-gray-600">Ты нашёл все пары!</p>
          
          <div className="bg-gray-100 rounded-xl p-6 mb-6 space-y-2">
            <div className="text-lg">
              <span className="font-semibold">Уровень:</span> {DIFFICULTY[difficulty].label}
            </div>
            <div className="text-lg">
              <span className="font-semibold">Ходов:</span> {moves}
            </div>
            <div className="text-lg">
              <span className="font-semibold">Время:</span> {formatTime(time)}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform hover:scale-105"
          >
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  const gridCols = difficulty === 'easy' ? 'grid-cols-5' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-4';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Панель управления */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">Ходы</div>
              <div className="text-2xl font-bold text-gray-800">{moves}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Время</div>
              <div className="text-2xl font-bold text-gray-800">{formatTime(time)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Пары</div>
              <div className="text-2xl font-bold text-gray-800">{solved.length / 2}/{cards.length / 2}</div>
            </div>
          </div>
          
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Shuffle size={20} />
            Новая игра
          </button>
        </div>

        {/* Игровое поле */}
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || solved.includes(index);
            
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="aspect-square cursor-pointer perspective"
              >
                <div
                  className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Рубашка карты */}
                  <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg flex items-center justify-center text-4xl"
                       style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <span className="text-white text-5xl">?</span>
                  </div>
                  
                  {/* Лицо карты */}
                  <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-white p-2 rotate-y-180 flex items-center justify-center">
                    <img 
                      src={card.image} 
                      alt="card" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

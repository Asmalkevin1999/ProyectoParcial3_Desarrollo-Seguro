import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Hoteles de ejemplo
  const hotels = await prisma.hotel.createMany({
    data: [
      { name: 'Gran Hotel Madrid', address: 'Calle Alcalá 1', city: 'Madrid', country: 'España', stars: 5, pricePerNight: 250.00, rooms: 120, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
      { name: 'Hotel Barcelona Beach', address: 'Paseo Marítimo 45', city: 'Barcelona', country: 'España', stars: 4, pricePerNight: 180.00, rooms: 80, imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400' },
      { name: 'Sevilla Palace', address: 'Avenida de la Constitución 10', city: 'Sevilla', country: 'España', stars: 4, pricePerNight: 150.00, rooms: 60, imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400' },
      { name: 'Valencia Resort', address: 'Calle Colón 22', city: 'Valencia', country: 'España', stars: 3, pricePerNight: 95.00, rooms: 45, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
    ],
  });

  // Huéspedes de ejemplo
  const guests = await prisma.guest.createMany({
    data: [
      { firstName: 'Juan', lastName: 'García', email: 'juan@email.com', phone: '+34 600 111 222', documentId: '12345678A' },
      { firstName: 'María', lastName: 'López', email: 'maria@email.com', phone: '+34 600 333 444', documentId: '87654321B' },
      { firstName: 'Carlos', lastName: 'Martínez', email: 'carlos@email.com', phone: '+34 600 555 666', documentId: '11223344C' },
    ],
  });

  console.log('✅ Seed completado');
  console.log(`   Hoteles: ${hotels.count}`);
  console.log(`   Huéspedes: ${guests.count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
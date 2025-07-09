const mongoose = require('mongoose');
const { hashPassword } = require('./src/utils/passwordUtils');
const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');
const Appointment = require('./src/models/Appointment');
const Review = require('./src/models/Review');
const { users, doctorProfiles, appointments, reviews } = require('./test-data');

// MongoDB bağlantısı
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/health-appointment-system');
        console.log('MongoDB bağlantısı başarılı');
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
};

// Kullanıcıları oluştur
const seedUsers = async () => {
    try {
        console.log('Kullanıcılar oluşturuluyor...');
        console.log('Test verileri:', users.length, 'kullanıcı bulundu');
        
        // Mevcut kullanıcıları temizle
        await User.deleteMany({});
        
        const createdUsers = [];
        
        for (const userData of users) {
            console.log('İşlenen kullanıcı:', userData);
            const hashedPassword = await hashPassword(userData.password);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            createdUsers.push(user);
            console.log(`Kullanıcı oluşturuldu: ${user.name} (${user.email})`);
        }
        
        console.log(`${createdUsers.length} kullanıcı başarıyla oluşturuldu`);
        return createdUsers;
    } catch (error) {
        console.error('Kullanıcı oluşturma hatası:', error);
        console.error('Hata detayı:', error.message);
        throw error;
    }
};

// Doktor profillerini oluştur
const seedDoctors = async (createdUsers) => {
    try {
        console.log('Doktor profilleri oluşturuluyor...');
        
        // Mevcut doktorları temizle
        await Doctor.deleteMany({});
        
        const doctorUsers = createdUsers.filter(user => user.role === 'doctor');
        const createdDoctors = [];
        
        for (let i = 0; i < doctorUsers.length && i < doctorProfiles.length; i++) {
            const doctorData = {
                ...doctorProfiles[i],
                user: doctorUsers[i]._id
            };
            
            const doctor = new Doctor(doctorData);
            await doctor.save();
            createdDoctors.push(doctor);
            console.log(`Doktor profili oluşturuldu: ${doctorUsers[i].name} - ${doctor.specialty}`);
        }
        
        console.log(`${createdDoctors.length} doktor profili başarıyla oluşturuldu`);
        return createdDoctors;
    } catch (error) {
        console.error('Doktor oluşturma hatası:', error);
        throw error;
    }
};

// Randevuları oluştur
const seedAppointments = async (createdUsers, createdDoctors) => {
    try {
        console.log('Randevular oluşturuluyor...');
        
        // Mevcut randevuları temizle
        await Appointment.deleteMany({});
        
        const patientUsers = createdUsers.filter(user => user.role === 'patient');
        const createdAppointments = [];
        
        for (let i = 0; i < appointments.length; i++) {
            const appointmentData = {
                userId: patientUsers[i % patientUsers.length]._id,
                doctorId: createdDoctors[i % createdDoctors.length]._id,
                date: new Date(appointments[i].date),
                time: appointments[i].time,
                status: appointments[i].status
            };
            
            const appointment = new Appointment(appointmentData);
            await appointment.save();
            createdAppointments.push(appointment);
            console.log(`Randevu oluşturuldu: ${appointment.date.toDateString()} ${appointment.time}`);
        }
        
        console.log(`${createdAppointments.length} randevu başarıyla oluşturuldu`);
        return createdAppointments;
    } catch (error) {
        console.error('Randevu oluşturma hatası:', error);
        throw error;
    }
};

// Yorumları oluştur
const seedReviews = async (createdUsers, createdDoctors) => {
    try {
        console.log('Yorumlar oluşturuluyor...');
        
        // Mevcut yorumları temizle
        await Review.deleteMany({});
        
        const patientUsers = createdUsers.filter(user => user.role === 'patient');
        const createdReviews = [];
        
        for (let i = 0; i < reviews.length; i++) {
            const reviewData = {
                userId: patientUsers[i % patientUsers.length]._id,
                doctorId: createdDoctors[i % createdDoctors.length]._id,
                rating: reviews[i].rating,
                comment: reviews[i].comment
            };
            
            const review = new Review(reviewData);
            await review.save();
            createdReviews.push(review);
            console.log(`Yorum oluşturuldu: ${review.rating} yıldız`);
        }
        
        console.log(`${createdReviews.length} yorum başarıyla oluşturuldu`);
        return createdReviews;
    } catch (error) {
        console.error('Yorum oluşturma hatası:', error);
        throw error;
    }
};

// Ana seed fonksiyonu
const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('=== VERİTABANI SEED İŞLEMİ BAŞLIYOR ===');
        
        const createdUsers = await seedUsers();
        const createdDoctors = await seedDoctors(createdUsers);
        const createdAppointments = await seedAppointments(createdUsers, createdDoctors);
        const createdReviews = await seedReviews(createdUsers, createdDoctors);
        
        console.log('\n=== SEED İŞLEMİ TAMAMLANDI ===');
        console.log(`Toplam ${createdUsers.length} kullanıcı`);
        console.log(`Toplam ${createdDoctors.length} doktor profili`);
        console.log(`Toplam ${createdAppointments.length} randevu`);
        console.log(`Toplam ${createdReviews.length} yorum`);
        
        console.log('\n=== TEST HESAPLARI ===');
        console.log('Admin: admin@healthapp.com / admin123');
        console.log('Doktor: ahmet.yilmaz@healthapp.com / doctor123');
        console.log('Hasta: hasta@test.com / hasta123');
        
        process.exit(0);
    } catch (error) {
        console.error('Seed işlemi hatası:', error);
        process.exit(1);
    }
};

// Script çalıştırma
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase }; 
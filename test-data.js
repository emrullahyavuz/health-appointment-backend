// API Test Verileri
// Bu dosya API testleri için örnek veriler içerir

// ========================================
// KULLANICI VERİLERİ
// ========================================

const users = [
    // Admin kullanıcılar
    {
        name: "Admin User",
        email: "admin@healthapp.com",
        password: "admin123",
        telephone: "5551234567",
        role: "admin",
        isActive: true
    },
    {
        name: "System Admin",
        email: "system@healthapp.com", 
        password: "system123",
        telephone: "5551234568",
        role: "admin",
        isActive: true
    },

    // Doktor kullanıcılar
    {
        name: "Dr. Ahmet Yılmaz",
        email: "ahmet.yilmaz@healthapp.com",
        password: "doctor123",
        telephone: "5551234569",
        role: "doctor",
        isActive: true
    },
    {
        name: "Dr. Ayşe Demir",
        email: "ayse.demir@healthapp.com",
        password: "doctor123",
        telephone: "5551234570",
        role: "doctor",
        isActive: true
    },
    {
        name: "Dr. Mehmet Kaya",
        email: "mehmet.kaya@healthapp.com",
        password: "doctor123",
        telephone: "5551234571",
        role: "doctor",
        isActive: true
    },
    {
        name: "Dr. Fatma Özkan",
        email: "fatma.ozkan@healthapp.com",
        password: "doctor123",
        telephone: "5551234572",
        role: "doctor",
        isActive: true
    },
    {
        name: "Dr. Ali Çelik",
        email: "ali.celik@healthapp.com",
        password: "doctor123",
        telephone: "5551234573",
        role: "doctor",
        isActive: true
    },

    // Hasta kullanıcılar
    {
        name: "Hasta Test",
        email: "hasta@test.com",
        password: "hasta123",
        telephone: "5551234574",
        role: "patient",
        isActive: true
    },
    {
        name: "John Doe",
        email: "john.doe@email.com",
        password: "patient123",
        telephone: "5551234575",
        role: "patient",
        isActive: true
    },
    {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        password: "patient123",
        telephone: "5551234576",
        role: "patient",
        isActive: true
    },
    {
        name: "Maria Garcia",
        email: "maria.garcia@email.com",
        password: "patient123",
        telephone: "5551234577",
        role: "patient",
        isActive: true
    }
];

// ========================================
// DOKTOR PROFİL VERİLERİ
// ========================================

const doctorProfiles = [
    {
        specialty: "Cardiology",
        experience: 15,
        education: "İstanbul Üniversitesi Tıp Fakültesi, Kardiyoloji Uzmanlığı",
        languages: ["Turkish", "English"],
        consultationFee: 500,
        location: "İstanbul, Kadıköy",
        about: "15 yıllık deneyimle kalp hastalıkları konusunda uzmanlaşmış kardiyolog. Modern tedavi yöntemleri ve hasta odaklı yaklaşım.",
        workingHours: [
            { day: "Monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
            { day: "Tuesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
            { day: "Wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
            { day: "Thursday", startTime: "09:00", endTime: "17:00", isAvailable: true },
            { day: "Friday", startTime: "09:00", endTime: "17:00", isAvailable: true }
        ],
        isAvailable: true,
        isVerified: true,
        rating: 4.8,
        reviewCount: 45,
        totalPatients: 1200
    },
    {
        specialty: "Neurology",
        experience: 12,
        education: "Ankara Üniversitesi Tıp Fakültesi, Nöroloji Uzmanlığı",
        languages: ["Turkish", "English", "German"],
        consultationFee: 600,
        location: "Ankara, Çankaya",
        about: "Nörolojik hastalıklar ve beyin sağlığı konusunda uzman. Migren, epilepsi ve nörodejeneratif hastalıklar alanında deneyimli.",
        workingHours: [
            { day: "Monday", startTime: "08:00", endTime: "16:00", isAvailable: true },
            { day: "Tuesday", startTime: "08:00", endTime: "16:00", isAvailable: true },
            { day: "Wednesday", startTime: "08:00", endTime: "16:00", isAvailable: true },
            { day: "Thursday", startTime: "08:00", endTime: "16:00", isAvailable: true },
            { day: "Friday", startTime: "08:00", endTime: "16:00", isAvailable: true }
        ],
        isAvailable: true,
        isVerified: true,
        rating: 4.6,
        reviewCount: 32,
        totalPatients: 850
    },
    {
        specialty: "Pediatrics",
        experience: 8,
        education: "Hacettepe Üniversitesi Tıp Fakültesi, Çocuk Sağlığı ve Hastalıkları Uzmanlığı",
        languages: ["Turkish", "English"],
        consultationFee: 400,
        location: "İzmir, Konak",
        about: "Çocuk sağlığı konusunda uzman. Yenidoğan bakımından ergenlik dönemine kadar tüm yaş gruplarında deneyimli.",
        workingHours: [
            { day: "Monday", startTime: "09:00", endTime: "18:00", isAvailable: true },
            { day: "Tuesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
            { day: "Wednesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
            { day: "Thursday", startTime: "09:00", endTime: "18:00", isAvailable: true },
            { day: "Friday", startTime: "09:00", endTime: "18:00", isAvailable: true },
            { day: "Saturday", startTime: "09:00", endTime: "14:00", isAvailable: true }
        ],
        isAvailable: true,
        isVerified: true,
        rating: 4.9,
        reviewCount: 67,
        totalPatients: 1500
    },
    {
        specialty: "Dermatology",
        experience: 10,
        education: "Ege Üniversitesi Tıp Fakültesi, Dermatoloji Uzmanlığı",
        languages: ["Turkish", "English", "French"],
        consultationFee: 450,
        location: "Bursa, Nilüfer",
        about: "Cilt hastalıkları, estetik dermatoloji ve cilt kanseri taraması konularında uzman. Modern dermatolojik tedavi yöntemleri.",
        workingHours: [
            { day: "Monday", startTime: "10:00", endTime: "18:00", isAvailable: true },
            { day: "Tuesday", startTime: "10:00", endTime: "18:00", isAvailable: true },
            { day: "Wednesday", startTime: "10:00", endTime: "18:00", isAvailable: true },
            { day: "Thursday", startTime: "10:00", endTime: "18:00", isAvailable: true },
            { day: "Friday", startTime: "10:00", endTime: "18:00", isAvailable: true }
        ],
        isAvailable: true,
        isVerified: true,
        rating: 4.7,
        reviewCount: 28,
        totalPatients: 950
    },
    {
        specialty: "Orthopedics",
        experience: 18,
        education: "Gazi Üniversitesi Tıp Fakültesi, Ortopedi ve Travmatoloji Uzmanlığı",
        languages: ["Turkish", "English"],
        consultationFee: 550,
        location: "Antalya, Muratpaşa",
        about: "Kemik ve eklem hastalıkları, spor yaralanmaları ve ortopedik cerrahi konularında uzman. Artroskopik cerrahi deneyimi.",
        workingHours: [
            { day: "Monday", startTime: "08:00", endTime: "17:00", isAvailable: true },
            { day: "Tuesday", startTime: "08:00", endTime: "17:00", isAvailable: true },
            { day: "Wednesday", startTime: "08:00", endTime: "17:00", isAvailable: true },
            { day: "Thursday", startTime: "08:00", endTime: "17:00", isAvailable: true },
            { day: "Friday", startTime: "08:00", endTime: "17:00", isAvailable: true }
        ],
        isAvailable: true,
        isVerified: true,
        rating: 4.5,
        reviewCount: 41,
        totalPatients: 1100
    }
];

// ========================================
// RANDEVU VERİLERİ
// ========================================

const appointments = [
    {
        date: "2024-01-15",
        time: "10:00",
        status: "confirmed"
    },
    {
        date: "2024-01-16",
        time: "14:30",
        status: "pending"
    },
    {
        date: "2024-01-17",
        time: "09:00",
        status: "confirmed"
    },
    {
        date: "2024-01-18",
        time: "16:00",
        status: "cancelled"
    },
    {
        date: "2024-01-19",
        time: "11:30",
        status: "pending"
    },
    {
        date: "2024-01-20",
        time: "13:00",
        status: "confirmed"
    },
    {
        date: "2024-01-22",
        time: "15:30",
        status: "pending"
    },
    {
        date: "2024-01-23",
        time: "08:00",
        status: "confirmed"
    }
];

// ========================================
// YORUM VERİLERİ
// ========================================

const reviews = [
    {
        rating: 5,
        comment: "Harika bir doktor! Çok ilgili ve profesyonel. Tedavi sürecim boyunca her adımda bilgilendirildim."
    },
    {
        rating: 4,
        comment: "İyi bir doktor, randevu saatinde geldi ve sorunumu çözdü. Tavsiye ederim."
    },
    {
        rating: 5,
        comment: "Çok deneyimli ve güvenilir. Uzun süredir devam eden sorunumu kısa sürede çözdü."
    },
    {
        rating: 4,
        comment: "Profesyonel yaklaşım ve modern tedavi yöntemleri. Memnun kaldım."
    },
    {
        rating: 3,
        comment: "İyi doktor ama biraz aceleci. Daha detaylı açıklama yapabilirdi."
    },
    {
        rating: 5,
        comment: "Mükemmel! Hem teknik bilgisi hem de hasta iletişimi çok iyi."
    },
    {
        rating: 4,
        comment: "Deneyimli ve güvenilir. Tedavi sürecim başarılı geçti."
    },
    {
        rating: 5,
        comment: "Çok ilgili ve sabırlı. Sorularımı detaylıca cevapladı."
    }
];

// ========================================
// API TEST ÖRNEKLERİ
// ========================================

const apiTestExamples = {
    // Auth API Testleri
    auth: {
        register: {
            url: "POST /api/auth/register",
            body: {
                name: "Test User",
                email: "test@example.com",
                password: "test123",
                telephone: "5551234567",
                role: "patient"
            }
        },
        login: {
            url: "POST /api/auth/login",
            body: {
                email: "test@example.com",
                password: "test123"
            }
        },
        updatePassword: {
            url: "POST /api/auth/update-password",
            headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" },
            body: {
                oldPassword: "test123",
                newPassword: "newtest123"
            }
        }
    },

    // Doctor API Testleri
    doctors: {
        getAllDoctors: {
            url: "GET /api/doctors",
            query: {
                specialty: "Cardiology",
                location: "İstanbul",
                minRating: 4.5,
                maxFee: 600,
                page: 1,
                limit: 10,
                sortBy: "rating",
                sortOrder: "desc"
            }
        },
        getDoctorById: {
            url: "GET /api/doctors/:id",
            params: { id: "DOCTOR_ID" }
        },
        getDoctorReviews: {
            url: "GET /api/doctors/:id/reviews",
            params: { id: "DOCTOR_ID" },
            query: { page: 1, limit: 10 }
        },
        createDoctorProfile: {
            url: "POST /api/doctors/profile",
            headers: { "Authorization": "Bearer DOCTOR_TOKEN" },
            body: {
                specialty: "Cardiology",
                experience: 10,
                education: "Tıp Fakültesi, Kardiyoloji Uzmanlığı",
                languages: ["Turkish", "English"],
                consultationFee: 500,
                location: "İstanbul, Kadıköy",
                about: "Kardiyoloji uzmanı",
                workingHours: [
                    {
                        day: "Monday",
                        startTime: "09:00",
                        endTime: "17:00",
                        isAvailable: true
                    }
                ]
            }
        },
        updateDoctorProfile: {
            url: "PUT /api/doctors/profile",
            headers: { "Authorization": "Bearer DOCTOR_TOKEN" },
            body: {
                consultationFee: 550,
                about: "Güncellenmiş hakkında bilgisi"
            }
        },
        updateAvailability: {
            url: "PUT /api/doctors/availability",
            headers: { "Authorization": "Bearer DOCTOR_TOKEN" },
            body: {
                isAvailable: false,
                workingHours: [
                    {
                        day: "Monday",
                        startTime: "10:00",
                        endTime: "16:00",
                        isAvailable: true
                    }
                ]
            }
        },
        getDoctorAppointments: {
            url: "GET /api/doctors/appointments/me",
            headers: { "Authorization": "Bearer DOCTOR_TOKEN" },
            query: { status: "pending", page: 1, limit: 10 }
        },
        getDoctorStats: {
            url: "GET /api/doctors/stats/me",
            headers: { "Authorization": "Bearer DOCTOR_TOKEN" }
        }
    },

    // Admin API Testleri
    admin: {
        getAllDoctors: {
            url: "GET /api/doctors/admin/all",
            headers: { "Authorization": "Bearer ADMIN_TOKEN" },
            query: { isVerified: true, page: 1, limit: 10 }
        },
        verifyDoctor: {
            url: "PUT /api/doctors/admin/:id/verify",
            headers: { "Authorization": "Bearer ADMIN_TOKEN" },
            params: { id: "DOCTOR_ID" },
            body: { isVerified: true }
        }
    }
};

// ========================================
// CURL ÖRNEKLERİ
// ========================================

const curlExamples = {
    // Kullanıcı Kaydı
    register: `curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "telephone": "5551234567",
    "role": "patient"
  }'`,

    // Kullanıcı Girişi
    login: `curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'`,

    // Tüm Doktorları Getir
    getAllDoctors: `curl -X GET "http://localhost:3000/api/doctors?specialty=Cardiology&minRating=4.5&page=1&limit=10"`,

    // Doktor Profili Oluştur
    createDoctorProfile: `curl -X POST http://localhost:3000/api/doctors/profile \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN" \\
  -d '{
    "specialty": "Cardiology",
    "experience": 10,
    "education": "Tıp Fakültesi, Kardiyoloji Uzmanlığı",
    "languages": ["Turkish", "English"],
    "consultationFee": 500,
    "location": "İstanbul, Kadıköy",
    "about": "Kardiyoloji uzmanı",
    "workingHours": [
      {
        "day": "Monday",
        "startTime": "09:00",
        "endTime": "17:00",
        "isAvailable": true
      }
    ]
  }'`,

    // Doktor İstatistikleri
    getDoctorStats: `curl -X GET http://localhost:3000/api/doctors/stats/me \\
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN"`,

    // Admin: Doktor Doğrula
    adminVerifyDoctor: `curl -X PUT http://localhost:3000/api/doctors/admin/DOCTOR_ID/verify \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\
  -d '{"isVerified": true}'`
};

// ========================================
// POSTMAN COLLECTION ÖRNEĞİ
// ========================================

const postmanCollection = {
    info: {
        name: "Health Appointment API",
        description: "Sağlık randevu sistemi API testleri"
    },
    item: [
        {
            name: "Auth",
            item: [
                {
                    name: "Register",
                    request: {
                        method: "POST",
                        url: "{{baseUrl}}/api/auth/register",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify(apiTestExamples.auth.register.body)
                        }
                    }
                },
                {
                    name: "Login",
                    request: {
                        method: "POST",
                        url: "{{baseUrl}}/api/auth/login",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify(apiTestExamples.auth.login.body)
                        }
                    }
                }
            ]
        },
        {
            name: "Doctors",
            item: [
                {
                    name: "Get All Doctors",
                    request: {
                        method: "GET",
                        url: "{{baseUrl}}/api/doctors",
                        query: [
                            { key: "specialty", value: "Cardiology" },
                            { key: "minRating", value: "4.5" },
                            { key: "page", value: "1" },
                            { key: "limit", value: "10" }
                        ]
                    }
                },
                {
                    name: "Create Doctor Profile",
                    request: {
                        method: "POST",
                        url: "{{baseUrl}}/api/doctors/profile",
                        header: [
                            { key: "Content-Type", value: "application/json" },
                            { key: "Authorization", value: "Bearer {{doctorToken}}" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify(apiTestExamples.doctors.createDoctorProfile.body)
                        }
                    }
                }
            ]
        }
    ],
    variable: [
        { key: "baseUrl", value: "http://localhost:3000" },
        { key: "doctorToken", value: "YOUR_DOCTOR_TOKEN" },
        { key: "adminToken", value: "YOUR_ADMIN_TOKEN" }
    ]
};

module.exports = {
    users,
    doctorProfiles,
    appointments,
    reviews,
    apiTestExamples,
    curlExamples,
    postmanCollection
}; 
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const getNews = require('./utils/news')

const app = express()

// Path configuration
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// Setup handlebars
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// Handlebars helper untuk format tanggal
hbs.registerHelper('formatDate', function(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Tanggal tidak tersedia';
    }
});

// Setup static directory
app.use(express.static(direktoriPublic))

// Routes
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca & Berita',
        nama: 'Hasanul Fikri',
        pageTitle: 'Beranda'
    })
})

app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Hasanul Fikri',
        pageTitle: 'Tentang Saya'
    })
})

app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Bantuan & FAQ',
        nama: 'Hasanul Fikri',
        pageTitle: 'Bantuan'
    })
})

// Rute halaman berita dengan debugging
app.get('/berita', (req, res) => {
    console.log('📨 GET Request received for /berita')
    
    getNews((error, berita) => {
        console.log('🔄 Callback executed - Error:', error, 'News count:', berita?.length)
        
        if (error) {
            console.log('❌ Error in news callback:', error)
            return res.render('berita', {
                judul: 'Berita Terkini',
                nama: 'Hasanul Fikri',
                pageTitle: 'Berita',
                error: error,
                berita: null
            })
        }
        
        console.log(`✅ Rendering template with ${berita.length} news items`)
        console.log('📰 First news title:', berita[0]?.title)
        
        res.render('berita', {
            judul: 'Berita Terkini',
            nama: 'Hasanul Fikri',
            pageTitle: 'Berita',
            berita: berita,
            error: null
        })
    })
})

// Weather API endpoint
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

// Error routes
app.get('/bantuan/*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Hasanul Fikri',
        pesankesalahan: 'Artikel yang dicari tidak ditemukan.',
        pageTitle: '404'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Hasanul Fikri',
        pesankesalahan: 'Halaman tidak ditemukan.',
        pageTitle: '404'
    })
})

// Start server
app.listen(4000, () => {
    console.log('🚀 Server berjalan pada port 4000')
    console.log('📰 News API Route: http://localhost:4000/berita')
    console.log('🌤️ Weather API Route: http://localhost:4000/infocuaca?address=jakarta')
})
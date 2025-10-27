const request = require('postman-request')

const API_KEY = '4ba996a3a604ce4422196d3b136cd553'

const getNews = (callback) => {
    console.log('🔄 Memuat berita dari MediaStack API...')
    
    // Coba tanpa parameter languages dulu
    const url = `http://api.mediastack.com/v1/news?access_key=${API_KEY}&limit=5`
    
    console.log('📡 API Request URL:', url.replace(API_KEY, '***'))

    request({ 
        url: url, 
        json: true,
        timeout: 10000
    }, (error, response) => {
        if (error) {
            console.error('❌ Error koneksi:', error.message)
            const fallbackNews = getDummyNews()
            console.log('📊 Fallback news data:', fallbackNews.length, 'items')
            callback(undefined, fallbackNews)
        } else if (response.body.error) {
            console.error('❌ Error API:', response.body.error)
            const fallbackNews = getDummyNews()
            console.log('📊 Fallback news data:', fallbackNews.length, 'items')
            callback(undefined, fallbackNews)
        } else if (response.body.data && response.body.data.length > 0) {
            console.log(`✅ API Success: ${response.body.data.length} berita diterima`)
            console.log('📰 Sample news title:', response.body.data[0]?.title)
            
            const processedNews = response.body.data.map((news, index) => {
                return {
                    id: index + 1,
                    title: news.title || 'Judul tidak tersedia',
                    description: news.description || 'Deskripsi tidak tersedia',
                    url: news.url || '#',
                    source: news.source || 'Sumber tidak diketahui',
                    image: news.image || null,
                    category: news.category || 'Umum',
                    published_at: news.published_at || new Date().toISOString(),
                    author: news.author || 'Tidak diketahui'
                }
            })
            
            console.log('📊 Processed news:', processedNews.length, 'items')
            callback(undefined, processedNews)
        } else {
            console.log('⚠️ No data from API, using fallback')
            const fallbackNews = getDummyNews()
            console.log('📊 Fallback news data:', fallbackNews.length, 'items')
            callback(undefined, fallbackNews)
        }
    })
}

function getDummyNews() {
    console.log('📝 Generating dummy news...')
    return [
        {
            id: 1,
            title: 'Berita Demo 1 - Integrasi MediaStack API',
            description: 'Aplikasi berita berhasil mengintegrasikan MediaStack API untuk menampilkan berita terkini dari berbagai sumber.',
            url: '#',
            source: 'Tech News',
            image: null,
            category: 'teknologi',
            published_at: new Date().toISOString(),
            author: 'Hasanul Fikri'
        },
        {
            id: 2,
            title: 'Pengembangan Aplikasi Web dengan Node.js',
            description: 'Node.js dan Express.js menjadi pilihan populer untuk pengembangan aplikasi web modern yang scalable dan efisien.',
            url: '#',
            source: 'Web Dev Journal',
            image: null,
            category: 'teknologi',
            published_at: new Date().toISOString(),
            author: 'Web Developer'
        },
        {
            id: 3,
            title: 'Inovasi Teknologi Pendidikan Digital',
            description: 'Transformasi digital dalam sektor pendidikan membuka peluang baru untuk pembelajaran yang lebih interaktif dan accessible.',
            url: '#',
            source: 'EduTech Review',
            image: null,
            category: 'pendidikan',
            published_at: new Date().toISOString(),
            author: 'Education Expert'
        }
    ]
}

module.exports = getNews
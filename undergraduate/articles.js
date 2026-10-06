// 扩展阅读文章模块

function initializeArticles() {
    // 文章功能初始化
    console.log('文章模块初始化完成');
}

// 加载文章数据
async function loadArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    
    try {
        showLoading(articlesGrid);
        const articles = await loadData('articles');
        displayArticles(articles);
    } catch (error) {
        showError(articlesGrid, '加载文章失败，请稍后重试');
        console.error('加载文章失败:', error);
    }
}

// 显示文章列表
function displayArticles(articles) {
    const articlesGrid = document.getElementById('articles-grid');
    
    if (articles.length === 0) {
        articlesGrid.innerHTML = '<div class="empty-state">暂无文章内容</div>';
        return;
    }
    
    articlesGrid.innerHTML = articles.map(article => `
        <div class="article-card glass-card" onclick="openArticle(${article.id})">
            <div class="article-image">
                📖
            </div>
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span class="article-date">${formatDate(article.date)}</span>
                    <span class="article-read-time">阅读时间：${article.read_time}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // 添加动画效果
    const articleCards = articlesGrid.querySelectorAll('.article-card');
    articleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both';
    });
}

// 打开文章详情
function openArticle(articleId) {
    loadArticleContent(articleId).then(article => {
        if (article) {
            displayArticleModal(article);
        }
    });
}

// 加载文章内容
async function loadArticleContent(articleId) {
    try {
        const articles = await loadData('articles');
        return articles.find(article => article.id === articleId);
    } catch (error) {
        console.error('加载文章内容失败:', error);
        return null;
    }
}

// 在模态框中显示文章
function displayArticleModal(article) {
    const modal = document.getElementById('article-modal');
    const articleContent = document.getElementById('article-content');
    
    // 格式化文章内容
    const formattedContent = formatArticleContent(article.content);
    
    articleContent.innerHTML = `
        <article class="article-detail">
            <header class="article-header">
                <h1 class="article-detail-title">${article.title}</h1>
                <div class="article-detail-meta">
                    <span class="article-detail-date">${formatDate(article.date)}</span>
                    <span class="article-detail-read-time">阅读时间：${article.read_time}</span>
                </div>
            </header>
            <div class="article-detail-excerpt">
                <p>${article.excerpt}</p>
            </div>
            <div class="article-detail-content">
                ${formattedContent}
            </div>
            <footer class="article-detail-footer">
                <div class="article-actions">
                    <button class="glass-button" onclick="shareArticle(${article.id})">
                        📤 分享
                    </button>
                    <button class="glass-button" onclick="printArticle(${article.id})">
                        🖨️ 打印
                    </button>
                </div>
            </footer>
        </article>
    `;
    
    // 打开模态框
    openModal('article-modal');
    
    // 添加阅读进度跟踪
    trackReadingProgress(article.id);
}

// 格式化文章内容（支持Markdown样式）
function formatArticleContent(content) {
    // 简单的Markdown样式转换
    let formatted = content
        // 标题
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // 粗体
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        // 斜体
        .replace(/\*(.*)\*/g, '<em>$1</em>')
        // 列表
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        // 段落
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gim, '<p>$1</p>');
    
    // 处理列表
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // 清理多余的标签
    formatted = formatted.replace(/<p><h([1-3])>/g, '<h$1>')
        .replace(/<\/h([1-3])><\/p>/g, '</h$1>')
        .replace(/<p><ul>/g, '<ul>')
        .replace(/<\/ul><\/p>/g, '</ul>');
    
    return formatted;
}

// 跟踪阅读进度
function trackReadingProgress(articleId) {
    const articleContent = document.querySelector('.article-detail-content');
    if (!articleContent) return;
    
    let startTime = Date.now();
    let hasScrolled = false;
    let scrollProgress = 0;
    
    // 监听滚动事件
    const scrollHandler = throttle(() => {
        hasScrolled = true;
        
        const scrollTop = articleContent.scrollTop;
        const scrollHeight = articleContent.scrollHeight - articleContent.clientHeight;
        scrollProgress = Math.min((scrollTop / scrollHeight) * 100, 100);
        
        // 可以在这里更新UI显示阅读进度
        updateReadingProgress(scrollProgress);
    }, 100);
    
    articleContent.addEventListener('scroll', scrollHandler);
    
    // 页面卸载时记录阅读数据
    window.addEventListener('beforeunload', () => {
        const readingTime = Math.floor((Date.now() - startTime) / 1000);
        
        // 保存阅读数据到本地存储
        if (!window.readingProgress) {
            window.readingProgress = {};
        }
        
        window.readingProgress[articleId] = {
            readingTime: readingTime,
            scrollProgress: scrollProgress,
            hasScrolled: hasScrolled,
            lastRead: new Date().toISOString()
        };
        
        // 保存到localStorage
        localStorage.setItem('readingProgress', JSON.stringify(window.readingProgress));
    });
}

// 更新阅读进度显示
function updateReadingProgress(progress) {
    // 可以添加进度条或其他UI元素显示阅读进度
    const progressIndicator = document.querySelector('.reading-progress-indicator');
    if (progressIndicator) {
        progressIndicator.style.width = `${progress}%`;
    }
}

// 分享文章
function shareArticle(articleId) {
    // 简单的分享功能
    if (navigator.share) {
        loadArticleContent(articleId).then(article => {
            if (article) {
                navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href
                }).catch(console.error);
            }
        });
    } else {
        // 复制链接到剪贴板
        copyToClipboard(window.location.href);
        alert('文章链接已复制到剪贴板！');
    }
}

// 打印文章
function printArticle(articleId) {
    loadArticleContent(articleId).then(article => {
        if (article) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${article.title}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
                        h1, h2, h3 { color: #333; }
                        p { margin-bottom: 1rem; }
                        ul { margin-left: 2rem; }
                        @media print { body { padding: 1rem; } }
                    </style>
                </head>
                <body>
                    <h1>${article.title}</h1>
                    <p><small>发布日期：${formatDate(article.date)} | 阅读时间：${article.read_time}</small></p>
                    <hr>
                    ${formatArticleContent(article.content)}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    });
}

// 复制到剪贴板
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// 搜索文章功能（可以扩展）
function searchArticles(query) {
    loadData('articles').then(articles => {
        const filteredArticles = articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase())
        );
        displayArticles(filteredArticles);
    });
}

// 添加文章样式
const articleStyle = document.createElement('style');
articleStyle.textContent = `
    .article-detail {
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.8;
    }
    
    .article-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .article-detail-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 1rem;
        line-height: 1.3;
    }
    
    .article-detail-meta {
        color: var(--text-medium);
        font-size: 0.9rem;
    }
    
    .article-detail-excerpt {
        background: rgba(255, 255, 255, 0.3);
        padding: 1.5rem;
        border-radius: 16px;
        margin: 2rem 0;
        font-size: 1.1rem;
        color: var(--text-dark);
        border-left: 4px solid var(--morandi-blue);
    }
    
    .article-detail-content {
        color: var(--text-dark);
        max-height: 70vh;
        overflow-y: auto;
        padding-right: 1rem;
    }
    
    .article-detail-content h1 {
        font-size: 1.8rem;
        font-weight: 600;
        margin: 2rem 0 1rem 0;
        color: var(--text-dark);
    }
    
    .article-detail-content h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 1.5rem 0 1rem 0;
        color: var(--text-dark);
    }
    
    .article-detail-content h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin: 1rem 0 0.5rem 0;
        color: var(--text-dark);
    }
    
    .article-detail-content p {
        margin-bottom: 1rem;
        text-align: justify;
    }
    
    .article-detail-content ul {
        margin: 1rem 0;
        padding-left: 2rem;
    }
    
    .article-detail-content li {
        margin-bottom: 0.5rem;
    }
    
    .article-detail-content strong {
        color: var(--text-dark);
        font-weight: 600;
    }
    
    .article-detail-footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .article-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .reading-progress-indicator {
        position: fixed;
        top: 80px;
        left: 0;
        height: 3px;
        background: var(--morandi-green);
        z-index: 1001;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: 0%;
    }
    
    .empty-state {
        text-align: center;
        color: var(--text-medium);
        font-size: 1.1rem;
        padding: 3rem;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
    
    @media (max-width: 768px) {
        .article-detail-content {
            max-height: 60vh;
            padding-right: 0.5rem;
        }
        
        .article-detail-title {
            font-size: 1.5rem;
        }
        
        .article-detail-excerpt {
            font-size: 1rem;
            padding: 1rem;
        }
    }
`;
document.head.appendChild(articleStyle);

// 添加阅读进度指示器
const progressIndicator = document.createElement('div');
progressIndicator.className = 'reading-progress-indicator';
document.body.appendChild(progressIndicator);

// 导出函数
window.openArticle = openArticle;
window.shareArticle = shareArticle;
window.printArticle = printArticle;
window.searchArticles = searchArticles;

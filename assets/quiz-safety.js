window.QuizSafety = {
    hasAnswer(question) {
        if (!question || question.reviewReason || !Array.isArray(question.options)) return false;
        const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
        return answers.length > 0 && (question.type === 'multi' || answers.length === 1) &&
            new Set(answers).size === answers.length &&
            answers.every(index => Number.isInteger(index) && index >= 0 && index < question.options.length);
    },
    escape(value) {
        return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[ch]);
    },
    showStatus(container, questions) {
        let notice = document.getElementById('quiz-data-status');
        if (!notice) {
            notice = document.createElement('p');
            notice.id = 'quiz-data-status';
            notice.style.cssText = 'margin:0 0 18px;color:#64748b;font-size:14px;line-height:1.7;';
            container.before(notice);
        }
        const ready = questions.filter(question => this.hasAnswer(question)).length;
        notice.textContent = `${ready} 道可评分 · ${questions.length - ready} 道待核对。答案依据课程原资料；刷新页面会重置本次练习。`;
    },
    pendingAction(question) {
        const reason = question.reviewReason || '原资料暂缺有效答案';
        return `<div role="status" style="margin-top:16px;padding:14px;border:1px solid #e8cf96;border-radius:12px;background:#fff8e8;color:#78551b;font-size:14px;line-height:1.6;">答案待核对 · ${this.escape(reason)}。本题暂不计入评分，可以继续下一题。</div>`;
    }
};

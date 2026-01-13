const SecurityUtils = {
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        
        const reg = /[&<>"'`=\/]/g;
        return input.replace(reg, (match) => map[match]);
    },

    validateSearchQuery: (query) => {
        if (typeof query !== 'string') return false;
        
        if (query.length > 200) return false;
        
        const dangerousPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC)\b)/i,
            /(--|\/\*|\*\/|;)/,
            /(\b(OR|AND)\b\s+\d+\s*[=<>])/i,
            /(DROP\s+TABLE|ALTER\s+TABLE|CREATE\s+TABLE)/i
        ];
        
        return !dangerousPatterns.some(pattern => pattern.test(query));
    },

    validateId: (id) => {
        return /^\d+$/.test(id) && parseInt(id) > 0 && parseInt(id) < 1000000;
    },

    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

export default SecurityUtils;
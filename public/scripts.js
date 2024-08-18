document.querySelectorAll('.delete-book-button').forEach(button => {
    button.addEventListener('click', function(event) {
        const bookId = this.dataset.bookId;

        fetch(`/delete-book/${bookId}`, {
            method: 'DELETE',
        }).then(response => {
            if (response.ok) {
                alert('Book deleted successfully, redirecting to home...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000); 
            } else {
                alert('Failed to delete book');
            }
        });
    });
});

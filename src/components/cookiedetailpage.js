import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CookieDetailPage = () => {
    const { name } = useParams(); // Get the cookie name from the URL
    const decodedName = decodeURIComponent(name); // Decode any encoded characters
    const [cookie, setCookie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCookie = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/cookies/search?name=${decodedName}`);
                const data = await response.json();
                if (data.length > 0) {
                    setCookie(data[0]); // Assuming name is unique
                }
            } catch (error) {
                console.error('Error fetching cookie:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCookie();
    }, [decodedName]);

    if (loading) return <div>Loading...</div>;
    if (!cookie) return <div>Cookie not found!</div>;

    return (
        <div>
            <h1>{cookie.name}</h1>
            <img src={cookie.imageUrl} alt={cookie.name} />
            <p>{cookie.description}</p>
            <p>Price: ${cookie.price}</p>
            <p>Category: {cookie.category}</p>
            <p>{cookie.available ? 'In Stock' : 'Out of Stock'}</p>
        </div>
    );
};

export default CookieDetailPage;

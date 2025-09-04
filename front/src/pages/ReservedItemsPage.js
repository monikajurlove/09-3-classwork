import { useState, useEffect } from 'react';
import ItemCard from "../components/ItemCard";

function ReservedItemsPage({ user, setUser, reserved, setReserved }) {

    useEffect(() => {
        if (user) {
            fetch("http://localhost:2600/myreserved", {
                headers: {
                    "authorization": localStorage.getItem("token")
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setReserved(data.data);
                    }
                });
        }
    }, [user]);

    function onRemoveReservation(itemId) {
        fetch(`http://localhost:2600/unreserve/${itemId}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setReserved(prev => prev.filter(p => p._id !== itemId));

                    const updatedUser = data.user;
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setUser(updatedUser);
                } else {
                    alert(data.message);
                }
            });
    }

    const total = reserved.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <div className="grid-container">
            {reserved.map(item => (
                <ItemCard
                    key={item._id}
                    image={item.image}
                    title={item.title}
                    price={item.price}
                >
                    <button
                        className="btn-remove"
                        onClick={() => onRemoveReservation(item._id)}
                    >
                        Remove reservation
                    </button>
                </ItemCard>
            ))}

            <div className="total-box">
                <h3>Total reserved value: {total}</h3>
            </div>
        </div>
    );
}

export default ReservedItemsPage;

import {useState, useEffect } from 'react';
import ItemCard from "../components/ItemCard";

function AllItemsPage({ user, setUser, posts, setPosts }) {
    const [selectedItems, setSelectedItems] = useState([]);

    //gauti visus items, kai puslapis uzsikrauna
    useEffect(() => {
        fetch("http://localhost:2600/allitems")
            .then(res => res.json())
            .then(data => {
                if (!data.success) return;
                setPosts(data.data || []);
                console.log(data.data)
            });
    }, []);

    //kokie mygtukai turi but rodomi prie item
    function cardStatus(item, user, onDelete, onReserve) {
        const isOwner = user?._id === item.userId;  //ar sukure prisijunges user
        const isReservedByMe = user?._id === item.reservedBy;   //ar reservuotas prisijungusio user
        const isReservedByOther = item.reservedBy && item.reservedBy !== user?._id; //ar rezervuotas kito user

        if (isOwner && !item.reservedBy) {
            return (
                <>
                    <p className="status status-owner">Your item, not reserved</p>
                    <button className="btn-delete" onClick={() => onDelete(item._id)}>Delete</button>
                </>
            );
        }

        if (isOwner && item.reservedBy) {
            return <p className="status status-info">Your item is reserved, can't delete</p>;
        }

        if (isReservedByMe) {
            return <p className="status status-reserved">This item is reserved by you</p>;
        }

        if (isReservedByOther) {
            return <p className="status status-info">Already reserved by another user</p>;
        }

        //jei nerezervuotas niekeno - rodo reserve button
        return <button className="btn-reserve" onClick={() => onReserve(item._id)}>Reserve</button>;
    }

    // keliu item rezervavimas:
    //item pazymejimas/atzymejimas
    function reserveManyCheckbox (item) {
        const isOwner = user?._id === item.userId;
        const isReserved = item.reservedBy ? true : false;

        //checkbox rodomas tik prie kitu user sukurtu item kurie nera rezervuoti
        if (!isOwner && !isReserved) {
            return(
                <>
                    <p>Select multiple:</p>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelect(item._id)}
                    />
                </>)
        }
    }

    //issaugojimas pazymetu/atzymetu item i array
    function toggleSelect(itemId) {
        setSelectedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId] );
    }

    function onReserveMany() {
        if (selectedItems.length === 0) {
            alert("No items have been selected");
            return;
        }

        Promise.all(
            selectedItems.map(itemId =>
                fetch(`http://localhost:2600/reserve/${itemId}`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "authorization": localStorage.getItem("token")
                    }
                }).then(res => res.json())
            )
        ).then(results => {
            let successAny = false;
            const updatedPosts = [...posts];

            results.forEach(data => {
                if (data.success) {
                    successAny = true;
                    const index = updatedPosts.findIndex(p => p._id === data.data._id);
                    if (index !== -1) updatedPosts[index] = data.data;
                } else {
                    alert(data.message);
                }
            });

            //jei bent vienas tapo rezervuotas - atnaujinam posts
            if (successAny) {
                setPosts(updatedPosts);

                //imam paskutini atsakyma, kuriame bus teisinga, naujausia pinigu suma
                const last = results[results.length - 1];
                if (last.success && last.user) {
                    const updatedUser = last.user;
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setUser(updatedUser);
                }

                setSelectedItems([]);
            }
        });
    }

    //rezervavimas vieno item
    function onReserve(itemId) {
        fetch(`http://localhost:2600/reserve/${itemId}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPosts(prev =>
                        prev.map(p => (p._id === data.data._id ? data.data : p))
                    );
                    const updatedUser = data.user;
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setUser(updatedUser);
                } else {
                    alert(data.message);
                }
            });
    }

    //istrynimas
    function onDelete(itemId) {
        fetch(`http://localhost:2600/delete/${itemId}`, {
            method: "DELETE",
            headers: {
                "authorization": localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPosts(prev => prev.filter(p => p._id !== itemId));
                } else {
                    alert(data.message);
                }
            });
    }

    return (
        <div  className="p20">
            <div className="grid-container">
                {posts.map((item) => {
                    return (
                        <ItemCard
                            key={item?._id}
                            image={item?.image}
                            title={item?.title}
                            price={item?.price}
                            createdBy={user?.email === item?.userEmail ? 'You uploaded this item' : `Uploaded by: ${item?.userEmail}`}
                        >
                            {cardStatus(item, user, onDelete, onReserve)}
                            {reserveManyCheckbox(item, user)}
                        </ItemCard>
                    )
                })}

            </div>
            <button className='reserve' onClick={onReserveMany}>Reserve marked</button>
        </div>
    )
}

export default AllItemsPage;
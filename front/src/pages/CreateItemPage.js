import {useRef, useState} from "react";

function CreateItemPage() {
    const titleRef = useRef();
    const priceRef = useRef();
    const imageRef = useRef();
    const [message, setMessage] = useState('');

    function onCreateItem() {
        const item = {
            title: titleRef.current.value,
            price: priceRef.current.value,
            image: imageRef.current.value,
        };

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(item)
        };

        fetch("http://localhost:2600/createitem", options)
            .then(data => data.json())
            .then(res => {
                if (res.success === true) {
                    setMessage("Item created successfully!");
                    titleRef.current.value = "";
                    priceRef.current.value = "";
                    imageRef.current.value = "";
                } else {
                    setMessage(res.message);
                }
                setTimeout(() => setMessage(""), 3000);
            });
    }

    return (
        <div className='container'>
            <div className="box">
                <h2>Upload your product</h2>
                <input type="text" placeholder="Enter title" ref={titleRef}/>
                <input type="text" placeholder="Enter price" ref={priceRef}/>
                <input type="text" placeholder="Enter image URL" ref={imageRef}/>
                <button className="btn btn-create" onClick={onCreateItem}>Post product</button>
                {message && (
                    <p>{message}</p>
                )}
            </div>
        </div>
    );
}

export default CreateItemPage;

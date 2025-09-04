function ItemCard({image, title, price, children, createdBy}) {

    return (
        <div className="item-card">
            <img src={image} alt=""/>
            <h3>{title}</h3>
            <p>Price: {price} $</p>
            <p>{createdBy}</p>
            {children}
        </div>
    )
}

export default ItemCard;
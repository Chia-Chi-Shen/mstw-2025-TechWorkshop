import './KeyInput.css';

const KeyInput = () => {

    const handleClick = () => {
        const target = document.querySelector('.key-input')
        const key = target.value;
        localStorage.setItem('key', key);
        target.value = '';
        window.alert('Key saved successfully');
    }

    return (
        <div className="key-container">
            <span className="key-label">Subscription Key:</span>
            <input className="key-input" type="text" />
            <button className="key-button" onClick={handleClick}>Save</button>
        </div>
    )
}

export default KeyInput;
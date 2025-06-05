import { useState } from 'react'

function MyButton() {
    const [count, setCount] = useState(0)

    function handleClick() {
        setCount(count + 1)
    }

    return (
        <button className="my-button" onClick={handleClick}>
        Click Me {count}
        </button>
    )
}

export default MyButton
import React from 'react'

const IconContainer = ({ children, color, count, isLike, ...props }) => {
    return ( 
        <div className={`icon-group ${isLike && 'icon-isLike'}`} {...props}>
            <div className={`icon-container icon-${color}`}>
                {children}
            </div>
            {count > 0 && <p className={`icon-text-container icon-text-${color}`}>{count}</p>}
        </div>
     );
}
 
export default IconContainer;
import React from 'react'

interface Item {
    text: string;
}
interface ListItems {
    items: Array<Item>;
}

interface ItemLink {
    text: string;
    href: string;
}
interface ListItemsLink {
    items: Array<ItemLink>;
}

const BulletPoints = ({items}:ListItems) => {
  return (
    <div className='text-white'>
        <ul className="list-disc pl-4"> 
            {items.map((item,index) => {
                return (
                    <li key={index}>
                        {item.text}
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

const BulletPointsLink = ({items}:ListItemsLink) => {
  return (
    <div className='text-white'>
        <ul className="list-disc pl-4"> 
            {items.map((item,index) => {
                return (
                    <li key={index}>
                        {item.href==='' ? <span>{item.text}</span> :<a href={item.href}>{item.text}</a> }
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

export {BulletPoints,BulletPointsLink}
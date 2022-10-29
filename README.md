# CMPM 170 Jam 2 Prototype - Idle Game

## How to run this project
A local server is required to run this project. Visual Studio Code is a good option for this.
Using the [live server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), open this folder in Visual Studio Code, then at the bottom right of the window, press the live server button. This will open a window which will automatically refresh the project if any changes are made. 


## Some documentation of code
`./src/gameObject.js`
- contains GameObject class and its subclasses



### GameObject
GameObject takes an options object that accepts the following options:
- **element** - An HTML element. By default, it will create a div element.
- **tag** - A string HTML tag. If *element* is not defined, it will create a div element.
- **parent / container** - An HTML element. This will append *element* to the parent.
- **positionMode** - A position mode enumerator from GameObject.PositionModes. The default is ABSOLUTE.
Example:
```
const object = new GameObject({
    tag: 'div',
    parent: document.body
})
```

This will create a new div and append it to the document's body.
GameObject has many helper functions to make moving elements around easier.
- **setPosition(x, y)** - Set the position of the GameObject. The position mode should be ABSOLUTE.
- **translate(x, y)** - Offset the position.
- **setRotation(angle)** - Set the rotation to *angle* radians. Internally it uses the transform style.
- **rotate(angle)** - Offset the rotation by angle.
- **setScale(x, y)** - Set the scale. Internally it uses the transform style. Does not affect the width or height.
- **scale(x, y)** - Offset the scale.
- **setSize(w, h)** - Set the size of the element in pixels.
- **setOrigin(x, y)** - Set the origin of the element. This moves the pivot point based on x and y. Default is 0,0 (TOPLEFT), and an example of center is .5,.5
Position, rotation, scale, size, and origin have equivalent **getProperty()** methods.
- **setPositionMode(mode)** - Set the position mode from GameObject.PositionModes.
- **setAttribute(key, value)** - Set the attribute *key* with value *value*.
- **setStyle(key, value)** - Set the attribute *key* with value *value*.
- **setClass(className, bool)** - Toggle a HTML class with the bool value.
- **setId(id)** - Set the element's ID.
- **setParent(parent)** - Set the parent of the element. The parent can be an element or another GameObject.
- **appendChild(child)** - Appends a child to the element. The child can be an element or another GameObject.
- **removeChild(child)** - Removes a child from the element. The child can be an element or another GameObject, but must be a child of the parent.
Most of these set functions return the object, so they can be chained together. For example:
```
const object = new GameObject()
    .setStyle('width', '100px')
    .setStyle('height', '100px')
    .setStyle('backgroundColor', 'red')
    .setPosition(10, 10)
```


### ImageGameObject *extends GameObject*
ImageGameObject takes the same options as GameObject, with some extra options:
- **src** - A string path from the root folder. This is the image source.
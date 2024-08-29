import { useEffect, useState } from "react";

const App = () => {
  const [position,setPosition]=useState<{x:number;y:number}>({x:10,y:10});
  const [keyState,SetkeyState]=useState<{'ArrowUp':boolean;'ArrowDown':boolean;'ArrowLeft':boolean;'ArrowRight':boolean}>({
    'ArrowUp':false,'ArrowDown':false,'ArrowLeft':false,'ArrowRight':false
  });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const step=1;
  const trailLength = 200;
  const circleStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    position:'absolute' as 'absolute'
  };
  useEffect(()=>{
    const handleKeyDownEvent=(e:KeyboardEvent)=>{
        SetkeyState((prev)=>({...prev,[e.key]:true}));
    };
    const handleKeyUpEvent=(e:KeyboardEvent)=>{
      SetkeyState((prev)=>({...prev,[e.key]:false}));
  };

  const updatePosition = () => {
    setPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;

      if (keyState['ArrowUp']) newY -= step;
      if (keyState['ArrowDown']) newY += step;
      if (keyState['ArrowLeft']) newX -= step;
      if (keyState['ArrowRight']) newX += step;
      const circleSize=45;
      if (newX < 0) newX = 0;
        if (newX > containerSize.width - circleSize) newX = containerSize.width - circleSize;
        if (newY < 0) newY = 0;
        if (newY > containerSize.height - circleSize) newY = containerSize.height - circleSize;
        setTrail(prevTrail => {
          const newTrail = [...prevTrail, { x: newX, y: newY }];
          if (newTrail.length > trailLength) {
            newTrail.shift();
          }
          return newTrail;
        });
      return { x: newX, y: newY };
    });
  };
  const handleResize = () => {
    setContainerSize({ width: window.innerWidth, height: window.innerHeight });
  };
    window.addEventListener('keydown',handleKeyDownEvent);
    window.addEventListener('keyup',handleKeyUpEvent);
    window.addEventListener('resize',handleResize);
    const interval = setInterval(updatePosition,0.1);
    return()=>{
      window.removeEventListener('keydown',handleKeyDownEvent);
      window.removeEventListener('keyup',handleKeyUpEvent);
      window.removeEventListener('resize',handleResize);
      clearInterval(interval);
    }
  },[keyState])
  return <div className="relative">
    {trail.map((pos, index) => (
        <div className="w-10 h-10 rounded-full" key={index} style={{ left: `${pos.x}px`, top: `${pos.y}px`, position: 'absolute', opacity: 1 - (index / trailLength),
        transition: 'opacity 0.3s ease-out',
        backgroundColor:`rgb(255, ${trailLength-index}, ${trailLength-index})`}} id={`circle-${index}`} />
        
      ))}
    <div style={circleStyle} className="h-10 w-10 rounded-full"/></div>;
};

export default App;


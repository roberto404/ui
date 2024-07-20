

  /**
   * Move point to vector defined lenght
   */
  const movePointLength = (
    point: { x: number, y: number },
    vector: { x: number, y: number},
    length: number,
  ) => {
    
    const width = (vector.x - point.x);
    const height = (vector.y - point.y);
    
    const distance = Math.sqrt(width * width + height * height);
    
    return movePointFractional(point, vector, Math.min(1, length / distance));
  }

  /**
   * Move point to vector defined lenght
   */
  const movePointFractional = (
    point: { x: number, y: number },
    vector: { x: number, y: number },
    fraction: number,
    ) => {
    return {
      x: point.x + (vector.x - point.x) * fraction,
      y: point.y + (vector.y - point.y) * fraction
    };
  }


  /**
   * Parts Path ['M', '0', '100' ...]
   */
  export const getPathParts = (pathString: string): string[] =>
    pathString
      .split(/[,\s]/)
      .reduce((parts, part) => {
        const match = part.match("([a-zA-Z])(.+)");
        if (match) {
          parts.push(match[1]);
          parts.push(match[2]);
        } else {
          parts.push(part);
        }
        
        return parts;
      }, []);

  export const getPathCommands = (pathString: string): string[][] =>
    getPathParts(pathString).reduce((commands: string[][], part) => {
      if (parseFloat(part) == part && commands.length) {
        commands[commands.length - 1].push(part);
      } else {
        commands.push([part]);
      }
      
      return commands;
    }, []);

/**
 * Insert a cubic Bézier curve to path points 
 */
const roundPathCorners = (pathString: string, radius: number, useFractionalRadius = false) => {
  
  const adjustCommand = (cmd, newPoint) =>
  {
    if (cmd.length > 2) {
      cmd[cmd.length - 2] = newPoint.x;
      cmd[cmd.length - 1] = newPoint.y;
    }
  }
  
  const pointForCommand = (cmd) =>
  {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1]),
    };
  }

  
  
  
  /**
   * Path parts Group by args
   */
  const commands = getPathCommands(pathString);
  
  // Az eredményül kapott parancsok, szintén csoportosítva
  const resultCommands = [];
  
  // Ha több mint egy parancs van
  if (commands.length > 1) {

    const startPoint = pointForCommand(commands[0]);
    
    // Kezeli a zárt útvonal esetét egy "virtuális" záróvonal segítségével
    var virtualCloseLine = null;
    if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
      virtualCloseLine = ["L", startPoint.x, startPoint.y];
      commands[commands.length - 1] = virtualCloseLine;
    }
    
    // Mindig az első parancsot használjuk (de ez megváltozhat)
    resultCommands.push(commands[0]);
    
    for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
      var prevCmd = resultCommands[resultCommands.length - 1];
      var curCmd = commands[cmdIndex];
      
      // Kezeli a záró parancs esetét
      var nextCmd = (curCmd == virtualCloseLine)
        ? commands[1]
        : commands[cmdIndex + 1];
      
      // Néhány logikai vizsgálat eldönti, alkalmas-e a path kerekítésére
      if (nextCmd && prevCmd && (prevCmd.length > 2) && curCmd[0] == "L" && nextCmd.length > 2 && nextCmd[0] == "L") {
        // Számolja ki a pontokat, amelyekkel dolgozunk
        var prevPoint = pointForCommand(prevCmd);
        var curPoint = pointForCommand(curCmd);
        var nextPoint = pointForCommand(nextCmd);
        
        // A görbe kezdő- és végpontja csak a pontunk, amit az előző és a következő pont felé mozdítottunk
        var curveStart, curveEnd;
        
        if (useFractionalRadius) {
          curveStart = movePointFractional(curPoint, prevCmd.origPoint || prevPoint, radius);
          curveEnd = movePointFractional(curPoint, nextCmd.origPoint || nextPoint, radius);
        } else {
          curveStart = movePointLength(curPoint, prevPoint, radius);
          curveEnd = movePointLength(curPoint, nextPoint, radius);
        }
        
        // Beállítja a jelenlegi parancsot és hozzáadja azt
        adjustCommand(curCmd, curveStart);
        curCmd.origPoint = curPoint;
        resultCommands.push(curCmd);
        
        // A görbe vezérlőpontjai a görbe kezdetének és végének fele úton vannak, és
        // az eredeti pont felé
        var startControl = movePointFractional(curveStart, curPoint, .5);
        var endControl = movePointFractional(curPoint, curveEnd, .5);
  
        // Létrehozza a görbét
        var curveCmd = ["C", startControl.x, startControl.y, endControl.x, endControl.y, curveEnd.x, curveEnd.y];
        // Elmenti az eredeti pontot a törtrészes számolásokhoz
        curveCmd.origPoint = curPoint;
        resultCommands.push(curveCmd);
      } else {
        // Átengedi azokat a parancsokat, amelyek nem felelnek meg
        resultCommands.push(curCmd);
      }
    }
    
    // Javítja a kezdőpontot, és helyreállítja a zárt útvonalat, ha az eredetileg zárt volt
    if (virtualCloseLine) {
      var newStartPoint = pointForCommand(resultCommands[resultCommands.length - 1]);
      resultCommands.push(["Z"]);
      adjustCommand(resultCommands[0], newStartPoint);
    }
  } else {
    resultCommands = commands;
  }
  
  // Az eredmény parancsokat összefűzi egy karakterlánccá, majd visszaadja
  return resultCommands.reduce(function(str, c){ return str + c.join(" ") + " "; }, "");
}


export default roundPathCorners;
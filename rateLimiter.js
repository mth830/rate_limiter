class Queue {
  constructor(maxSize = 10) {
    this.maxSize = maxSize;
    this.size = 0;
    this.start = 0;
    this.end = 0;
    this.data = {};
  }
  enqueue = (element) => {
    if (this.size + 1 > this.maxSize) {
      throw new Error("Queue at capacity try increasing maxSize");
    }
    this.data[this.end] = element;
    this.end++;
    this.size++;
  }
  dequeue = () => {
    if (this.size < 1) {
      return null;
    }
    const element = this.data[this.start];
    delete this.data[this.start];
    this.start++;
    this.size--;
    if(this.size === 0){
      this.start=0;
      this.end=0;
    }
    return element;
  }
  front = () => {
    if (this.size < 1) {
      return null;
    }
    const element = this.data[this.start];
    return element;
  }
  back = () =>{
     if (this.size < 1) {
      return null;
    }
    const element = this.data[this.end-1];
    return element;
  }
}
class RateLimiter {
  constructor(timesPerSecond = 100,autoCleanDelayInSeconds=1) {
    this.timesPerSecond = timesPerSecond;
    this.idList = {};
    //setInterval(()=>this.autoClean(),autoCleanDelayInSeconds*1000);
  }
  autoClean=()=>{
    for(const id in this.idList){
      let timeQueue = this.idList[id];
      if(Date.now()-timeQueue.back()>=1000){
        delete this.idList[id];
      }
    }
  }
  addEntry = (id) => {
    if (!(id in this.idList)) {
      this.idList[id] = new Queue(this.timesPerSecond * 1.5);
    }
    let timeQueue = this.idList[id];
    const oneSecond = 1000;
    const olderThan1Sec = () => {
      let front = timeQueue.front();
      if (front === null) {
        return false;
      }
      return (Date.now() - front) > oneSecond;
    };
    while (timeQueue.size > 0 && olderThan1Sec()) {
      timeQueue.dequeue();
    }
    if (!this.canAddEntry(id)) {
      return false;
    }
    this.idList[id].enqueue(Date.now());
    return true;
  }
  canAddEntry = (id) => {
    return this.idList[id].size < this.timesPerSecond;
  }
}
let rl = new RateLimiter(30);
for (let i = 0; i < 100; i++) {
  const canAdd = rl.addEntry("a");
  console.log(`entry: ${i} can be added? ${canAdd}`);
}
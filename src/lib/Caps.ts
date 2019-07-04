class Caps{
  private value:boolean=false;

  
  public get switched() : boolean {
    return this.value
  }

  public on() {
    this.value=true;
  }
  public off() {
    this.value=false;
  } 
}

export default new Caps;
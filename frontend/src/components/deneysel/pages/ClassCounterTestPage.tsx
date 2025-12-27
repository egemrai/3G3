
import ClassCounterTest from "../classComponents/ClassCounterTest";
import ClassCounterErrorTest from "../../errorFallbacks/ClassCounterErrorTest";
import Counter from "../functionalComponents/Counter";


const ClassCounterTestPage = () => {

  const counterGrid = Array.from({length:3}, (_,i)=>{
    return(
    <div key={i}>
      <ClassCounterErrorTest>
        <ClassCounterTest initialCount={5} label="Örnek Sayaç"/>
      </ClassCounterErrorTest>
    </div>
  )})

  return( 
    <>
    {/* <ClassCounterErrorTest>
      <ClassCounterTest  />
    </ClassCounterErrorTest>
    <ClassCounterTest initialCount={5} label="Örnek Sayaç" /> */}
    {counterGrid}
    {<Counter/>}
    </>
  )
}



export default ClassCounterTestPage;
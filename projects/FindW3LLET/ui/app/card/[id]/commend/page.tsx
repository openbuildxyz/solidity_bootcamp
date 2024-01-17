import { InfoPlane, PlaneProps } from "@/components/InfoPlane";

const props : PlaneProps = {
    className:"flex-1 col-span-2 flex-grow max-h-[90vh]",
    header : { btnContent:'Back', title:'Comments', },
    body : {bodyType:'AComments',id:''},
    footer: {btnContent:'Write your comments',w:true}
}

type Props = {
    params: {
      id: string
    }
  }

export default function Page({ params } : Props) {
    props.body.id = params.id
    return (
        <InfoPlane {...props}/>
    )
}
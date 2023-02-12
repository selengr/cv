import styles from "../../styles/abacus/Abacus.module.css";
import { useEffect, useState, FC } from "react";


interface RegisterformValues { }
interface Verifycount {
    count: number;
}

const Plus: FC = () => {

    const [doCounting, setDoCounting] = useState<Verifycount>({ count: 0 })

    let one: string | NodeListOf<Element>,
        two: string | NodeListOf<Element>,
        three: string | NodeListOf<Element>,
        four: string | NodeListOf<Element>,
        five: string | NodeListOf<Element>

    const dataCell: number[] = [
        1, 2, 3, 4, 5, 6, 7
    ]

    useEffect(() => {

        one = document.querySelectorAll(".one")
        one.forEach((item: Element) => item.style.bottom = "0")
        two = document.querySelectorAll(".two")
        two.forEach((item: Element) => item.style.bottom = "36px")
        three = document.querySelectorAll(".three")
        three.forEach((item: Element) => item.style.bottom = "72px")
        four = document.querySelectorAll(".four")
        four.forEach((item: Element) => item.style.bottom = "108px")
        five = document.querySelectorAll(".five")
        five.forEach((item: Element) => item.style.top = "0")

    }, [])


    let num : string | number
    const validations = (e :  React.ChangeEvent<HTMLInputElement>, which : number, number : string, high : number) => {
        if (number !== 'not') {
            num = high && high + number
            num = number !== "not" ? number : num
            console.log("num", num)
        }

        if (high) {
            console.log(parseInt(num) + high)
        }

        let data = (e.target.id.slice(-1))
        Array.from(four);

        // 
        if (e.target.id == `four${which}`) {
            if (four[parseInt(data)].style.bottom == "144px") {
                four[parseInt(data)].style.bottom = "108px"
                three[parseInt(data)].style.bottom = "72px"
                two[parseInt(data)].style.bottom = "36px"
                one[parseInt(data)].style.bottom = "0px"
                return
            }
            four[parseInt(data)].style.bottom = "144px"
        }
        if (e.target.id == `three${which}`) {
            if (three[parseInt(data)].style.bottom == "108px") {
                three[parseInt(data)].style.bottom = "72px"
                two[parseInt(data)].style.bottom = "36px"
                one[parseInt(data)].style.bottom = "0px"
                return
            }

            four[parseInt(data)].style.bottom = "144px"
            three[parseInt(data)].style.bottom = "108px"
        }
        if (e.target.id == `two${which}`) {
            if (two[parseInt(data)].style.bottom == "72px") {
                two[parseInt(data)].style.bottom = "36px"
                one[parseInt(data)].style.bottom = "0px"
                return
            }
            four[parseInt(data)].style.bottom = "144px"
            three[parseInt(data)].style.bottom = "108px"
            two[parseInt(data)].style.bottom = "72px"
        }
        if (e.target.id == `one${which}`) {

            if (one[parseInt(data)].style.bottom == "36px") {
                one[parseInt(data)].style.bottom = "0px"
                return
            }
            four[parseInt(data)].style.bottom = "144px"
            three[parseInt(data)].style.bottom = "108px"
            two[parseInt(data)].style.bottom = "72px"
            one[parseInt(data)].style.bottom = "36px"
        }

        if (e.target.id === `five${which}`) {
            if (five[parseInt(data)].style.top == "36px") {
                five[parseInt(data)].style.top = "0px"
                return
            }
            five[parseInt(data)].style.top = "36px"
        }
    }


    const unit = (w : number) => {
        const move = (e : any, which :number, number : string|number, high? : number) => validations(e, which, number, high)

        return (
            <div className={styles.pack}>
                <div onClick={(e) => move(e, w, "not", 5)} data-id={`five${w}`} id={`five${w}`} className={`${styles.nut} five`}> </div>

                <div className={styles.pipe}>
                    {/* <div></div> */}
                </div>

                <div onClick={(e) => move(e, w, 1)} data-id={`four`} id={`four${w}`} className={`${styles.nut} four`}> </div>
                <div onClick={(e) => move(e, w, 2)} data-id={`three`} id={`three${w}`} className={`${styles.nut} three`}> </div>
                <div onClick={(e) => move(e, w, 3)} data-id={`two`} id={`two${w}`} className={`${styles.nut} two`}> </div>
                <div onClick={(e) => move(e, w, 4)} data-id={`one`} id={`one${w}`} className={`${styles.nut} one`}> </div>


            </div>
        )
    }


    return (
        <>
            <div className={styles.container}>

                {
                    dataCell.reverse().map((item, index) => {
                        return <div>
                            {unit(index)}
                            <span>{doCounting.count}</span>
                        </div>
                    })
                }

            </div>
        </>
    );
};

export default Plus;
import React, {Component, useState} from "react";
import Chart from "react-apexcharts";
import Modal from "../UI/Modal";

const BarChart = (props) =>  {
    let cat = props.repObject.cat;
    let adaab = props.repObject.adaab;
    let murajah = props.repObject.murajah;
    let hifz = props.repObject.hifz;

    console.log(" >>>>>>>  >>>>>>>   >>>>>> ", JSON.stringify(props))

    const[options, setOptions] = useState(
        { chart:{id: "basic-bar"},
          xaxis: {categories: cat }
       })
    const[series, setSeries] = useState([
        {
            name: "adaab",
            data: adaab
        },
        {
            name: "murajah",
            data: murajah
        },
        {
            name: "hifz",
            data: hifz
        }
    ]);

        return (
            <Modal onClose={() => {props.onClose()}}>
            <div className="app">
                <div className="row">
                    <div className="mixed-chart">
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            width="500"
                        />
                    </div>
                </div>
            </div>
            </Modal>
        );
}

export default BarChart;
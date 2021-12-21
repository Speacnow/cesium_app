
export default function (data, W, H) {
    let changeing = true;
    let t1 = new Date()
    let nn = 0
    //let all_change_i = []
    while (changeing) {
        changeing = false;
        let change_i = []
        data.forEach((e, i) => {
            if (e == 1) {
                let { array, $4, $8, $16, N8 } = P(i);
                // console.log($4, $8);
                if (($4 == 1 || $8 == 1) && ($8 > $16)) {
                    return;
                }
                if ($4 == 4) {
                    return;
                }
                if (N8 > 1) {
                    return;
                }
                let template1 = [];
                if (array[8] == 0) {
                    template1.push(Template1(array, 0, 4))
                }
                if (array[20] == 0) {
                    template1.push(Template1(array, 6, 2))
                }
                if (array[16] == 0) {
                    template1.push(Template1(array, 4, 0))
                }
                if (array[12] == 0) {
                    template1.push(Template1(array, 2, 6))
                }
                if (template1.filter(e => e == true).length == 1) {
                    return;
                }
                //赋值
                change_i.push(i)
                changeing = true
            }

        })
        change_i.forEach(e => {
            data[e] = 0;
        })
        // all_change_i.push(...change_i)
        nn++
    }
    if (nn % 2 == 1) {
        aa();
        bb();
    }
    if (nn % 2 == 0) {
        bb();
        aa();
    }
    function aa() {
        let changeing2 = true
        while (changeing2) {
            changeing2 = false;
            let change_i = []
            data.forEach((e, i) => {
                if (e == 1) {
                    let { array } = P(i);
                    array = array.slice(0, 8)
                    let template2 = []
                    template2.push(Template2(array, [2, 4], [0, 6, 7]))
                    template2.push(Template2(array, [0, 2], [4, 5, 6]))
                    if (template2.filter(e => e == true).length == 1) {
                        change_i.push(i)
                        changeing2 = true
                    }
                }

            })
            change_i.forEach(e => {
                data[e] = 0;
            })
            //all_change_i.push(...change_i)
            nn++
        }


    }
    function bb() {
        let changeing3 = true
        while (changeing3) {
            changeing3 = false;
            let change_i = []
            data.forEach((e, i) => {
                if (e == 1) {
                    let { array } = P(i);
                    array = array.slice(0, 8)
                    let template2 = []
                    // template2.push(Template2(array, [2, 4], [0, 6, 7]))
                    // template2.push(Template2(array, [0, 2], [4, 5, 6]))
                    template2.push(Template2(array, [4, 6], [0, 1, 2]))
                    template2.push(Template2(array, [6, 0], [2, 3, 4]))

                    if (template2.filter(e => e == true).length == 1) {
                        change_i.push(i)
                        changeing3 = true
                    }
                }

            })
            change_i.forEach(e => {
                data[e] = 0;
            })

            nn++

        }


    }
    let lines = track(data, W, H)

    return lines



    //图像追踪
    function track(data, W, H) {
        //P八领域数组
        let trans_w = [1, 1, 0, -1, -1, -1, 0, 1]
        let trans_h = [0, 1, 1, 1, 0, -1, -1, -1]
        let array_lines = []
        data.forEach((e, i) => {
            //起点
            if (e == 1) {

                let track_index = i;
                let line = []
                line.push(track_index)
                //标记已经去过的像素
                data[track_index] = 100;

                let P8_i = _P(track_index, data).findIndex(e => e == 1)

                while (P8_i !== -1) {
                    track_index = Cal_next_data_index(track_index, P8_i)
                    line.push(track_index)
                    //标记已经去过的像素
                    data[track_index] = 100;
                    P8_i = _P(track_index, data).findIndex(e => e == 1)
                }
                if (line.length > 1) array_lines.push(line)
            }
        })

        array_lines.forEach((e, i) => {
            array_lines[i] = e.map(e => dataindex_to_wh(e))

        })
        return array_lines



        //八领域数组
        function _P(index, data) {
            let { w, h } = dataindex_to_wh(index)

            let P = []
            for (let i = 0; i < 8; i++) {
                P.push(PX(w + trans_w[i], h + trans_h[i]))
            }
            function PX(w, h) {
                if (w >= 1 && w <= W && h >= 1 && h <= H) {
                    return data[W * (h - 1) + w - 1]
                }
                else {
                    return -1;
                }
            }

            return P;
        }
        //已知当前点（data[data_i]）的下一个点在八领域中的索引为P8_i，计算下一个点在data的索引

        function Cal_next_data_index(data_i, P8_i) {
            //计算data_i行列数
            let { w, h } = dataindex_to_wh(data_i)
            let next_w = w + trans_w[P8_i]
            let next_h = h + trans_h[P8_i]
            return (next_h - 1) * W + next_w - 1
        }
        function dataindex_to_wh(index) {
            index = index + 1
            let w = index % W == 0 ? W : index % W
            let h = Math.ceil(index / W)
            return { w, h }
        }
    }





    function Template1(array, i_1, i_0) {

        return array[i_1] == 1 && array[i_0] == 0
    }

    function Template2(array, indexies_1, indexies_0) {
        let flag = true;

        array.forEach((e, i) => {

            if (indexies_1.includes(i)) {
                if (e !== 1) flag = false;
            }
            if (indexies_0.includes(i)) {
                if (e !== 0) flag = false;
            }

        })
        return flag
    }








    function P(index) {
        let trans_w = [1, 1, 0, -1, -1, -1, 0, 1, 2, 2, 2, 1, 0, -1, -2, -2, -2, -2, -2, -1, 0, 1, 2, 2]
        let trans_h = [0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -2, -2, -2, -2, -2, -1, 0, 1, 2, 2, 2, 2, 2, 1]
        index = index + 1
        let w = index % W == 0 ? W : index % W
        let h = Math.ceil(index / W)

        let array = []
        for (let i = 0; i < 24; i++) {
            array.push(PX(w + trans_w[i], h + trans_h[i]))
        }
        let $4 = array[0] + array[2] + array[4] + array[6]
        let $8 = array.slice(0, 8).reduce((p, c) => p + c)
        let $16 = array.slice(8).reduce((p, c) => p + c)
        let N8 = 0;
        let array8 = array.slice(0, 8)
        array8.forEach((e, i) => {
            if (i == 0) {
                if (array8[0] - array8[7] == 1) N8++;
            }
            else {
                if (array8[i] - array8[i - 1] == 1) N8++;
            }
        })
        return { array, $4, $8, $16, N8 }

        function PX(w, h) {
            if (w >= 1 && w <= W && h >= 1 && h <= H) {
                return data[W * (h - 1) + w - 1]
            }
            else {
                return 0;
            }
        }
    }


}
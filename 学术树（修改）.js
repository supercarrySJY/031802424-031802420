const btn = document.getElementById('generate')
btn.onclick = () => {
    const textarea = document.getElementById('input')
    const input = textarea.value.trim()
    const labs = input.split('\n\n')
    console.log(labs)
    const data = []
    for (const lab of labs) {
        const lines = lab.trim().split('\n')
        const mentorRegex = /导师：(.+)/
        const mentor = lines[0].match(mentorRegex)[1]
        const labData = {
            id: mentor,
            children: []
        }
        const tmp = {}
        for (let line of lines) {
            line = line.trim()
            if (line.includes('导师')) {
                continue
            }
            const kv = line.split('：')
            const key = kv[0]
            const students = kv[1].split('、')
            for (let i in students) {
                students[i] = {
                    id: students[i]
                }
            }
            const year = key.match(/[0-9]+/)[0]
            const type = key.split('级')[1]
            if (tmp[year] === undefined) {
                tmp[year] = {}
            }
            tmp[year][type] = students
        }
        for (const key of Object.keys(tmp)) {
            const yearStds = tmp[key]
            console.log(yearStds)
            const types = ['本科生', '硕士生', '博士生']
            const yearChildren = []
            types.forEach(type => {
                console.log(yearStds[type])
                console.log(type)
                if (yearStds[type] !== undefined) {
                    console.log(1)
                    yearChildren.push({
                        id: type,
                        children: yearStds[type]
                    })
                }
            })
            console.log(yearChildren)
            const yearData = {
                id: key,
                children: yearChildren
            }
            labData.children.push(yearData)
        }
        data.push(labData)
        console.log(labData)
    }

    for (const item of data) {
        const ele = document.createElement('div')
        ele.id = item.id
        document.getElementById('nodes').appendChild(ele)
        generateGraph(ele.id, item)
    }
    document.getElementsByTagName('body').height = labs.length * 500 + 1000
}

const generateGraph = (container, data) => {
    var graph = new G6.TreeGraph({
        container: container,
        width: 800,
        height: 500,
        pixelRatio: 2,
        modes: {
            default: [{
                type: "collapse-expand",
                onChange: function onChange(item, collapsed) {
                    var data = item.get("model").data;
                    data.collapsed = collapsed;
                    return true;
                }
            }
            ]
        },
        defaultNode: {
            size: 16,
            anchorPoints: [
                [0, 0.5],
                [1, 0.5]
            ],
            style: {
                fill: "#ff408c",
                stroke: "#d90909"
            }
        },
        defaultEdge: {
            shape: "cubic-horizontal",
            style: {
                stroke: "#babfa3"
            }
        },
        layout: {
            type: "compactBox",
            direction: "LR",
            getId: function getId(d) {
                return d.id;
            },
            getHeight: function getHeight() {
                return 16;
            },
            getWidth: function getWidth() {
                return 16;
            },
            getVGap: function getVGap() {
                return 10;
            },
            getHGap: function getHGap() {
                return 100;
            }
        }
    });

    graph.node(function (node) {
        return {
            size: 26,
            style: {
                fill: "#ff408c",
                stroke: "#d90909"
            },
            label: node.id,
            labelCfg: {
                position: node.children && node.children.length > 0 ? "left" : "right"
            }
        };
    });

    graph.data(data);
    graph.render();
    graph.fitView();
}
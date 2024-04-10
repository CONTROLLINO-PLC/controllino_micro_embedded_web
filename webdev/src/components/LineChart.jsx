import { useEffect, useState } from "react";

export function LineChart({ data }) {
  const [min, setMin] = useState(0)
  const [proportion, setProportion] = useState(1)
  const [graph, setGraph] = useState([])
  const [secondGraph, setSecondGraph] = useState([])
  const [thirdGraph, setThirdGraph] = useState([])
  const [_, ...minusOne] = graph

  useEffect(() => {
    const max = Math.max(...data.map(d => d[1]), ...data.map(d => d[2]), ...data.map(d => d[3]))
    const min = Math.min(...data.map(d => d[1]), ...data.map(d => d[2]), ...data.map(d => d[3]))
    setMin(min)
    const proportion = max - min
    setProportion(proportion)

    setGraph(data.map(d => (d[1] - min) / proportion))
    setSecondGraph(data.map(d => (d[2] - min) / proportion))
    setThirdGraph(data.map(d => (d[3] - min) / proportion))
  }, [data])

  return (
    <svg className="w-full h-full">
      <g>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <line
            key={`horizontal-${i}`}
            x1="0%"
            y1={`${(95 - i * 10)}%`}
            x2="100%"
            y2={`${(95 - i * 10)}%`}
            stroke="gray"
            strokeWidth="0.5"
          />
        ))}
        {data.map((_, index) => (
          <line
            key={`vertical-${index}`}
            x1={`${((95 / data.length) * index + 5)}%`}
            y1="0%"
            x2={`${((95 / data.length) * index + 5)}%`}
            y2="100%"
            stroke="gray"
            strokeWidth="0.5"
          />
        ))}
        {graph.length > 1 ? (
          <>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <text
                  key={i + 'yaxis'}
                  x="0%"
                  y={(95 - i * 10) + '%'}
                  fill='gray'
                >
                  {(min + i * proportion / 10).toFixed(3)}
                </text>
              ))
            }
            {
              data.map((i, index) => (
                <text
                  key={index + 'xaxis'}
                  x={((95 / data.length) * index + 5) + '%'}
                  y={'100%'}
                  fill='gray'
                >
                  {i[0]}
                </text>
              ))
            }
            {minusOne.map((_, i) => (
              <line
                key={i}
                x1={(i / (graph.length - 1)) * 95 + 5 + '%'}
                y1={(95 - (graph[i] * 95)) + '%'}
                x2={((i + 1) / (graph.length - 1)) * 95 + 5 + '%'}
                y2={(95 - graph[i + 1] * 95) + '%'}
                stroke="yellow"
                strokeWidth="2"
              />

            ))}
            {minusOne.map((_, i) => (
              <line
                key={i + 'second'}
                x1={(i / (graph.length - 1)) * 88 + 5 + '%'}
                y1={(88 - (secondGraph[i] * 88)) + '%'}
                x2={((i + 1) / (graph.length - 1)) * 95 + 5 + '%'}
                y2={(88 - secondGraph[i + 1] * 88) + '%'}
                stroke="red"
                strokeWidth="4"
              />
            ))}
            {minusOne.map((_, i) => (
              <line
                key={i + 'third'}
                x1={(i / (graph.length - 1)) * 95 + 5 + '%'}
                y1={(95 - (thirdGraph[i] * 95)) + '%'}
                x2={((i + 1) / (graph.length - 1)) * 95 + 5 + '%'}
                y2={(95 - thirdGraph[i + 1] * 95) + '%'}
                stroke="#ed6c02"
                strokeWidth="4"
              />
            ))}
            {graph.map((point, index) => (
              <circle
                key={`point-${index}`}
                cx={((index / (graph.length - 1)) * 95 + 5) + '%'}
                cy={(95 - (graph[index] * 95)) + '%'}
                r="4"
                fill="yellow"
              />
            ))}
          </>
        ) : (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">...</text>
        )}
      </g>
    </svg>
  );
};
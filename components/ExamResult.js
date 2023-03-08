import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';

class ExamResult extends React.Component {
	render() {
		const { showResult, examResult, examTime, elapsedTime } = this.props;
		const { correct, wrong, empty, grade } = examResult;

		const colors = ['#00bfa5', '#ff5252', '#ff6e40'];
		const chartData = [
			{ name: "Doğru", value: correct },
			{ name: "Yanlış", value: wrong },
			{ name: "Boş", value: empty },
		];

		return showResult && (
			<div className="card z-depth-1">
				<div className="col-md-12">
					<div className="col-md-12">
						<h2>Sınav Cevap Kağıdı</h2>
					</div>
					<div className="col-md-12 font-size-16">
						<div className="col-md-4">
							<ResponsiveContainer width="70%" height={130}>
								<PieChart>
									<Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}>
										{
											chartData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={colors[index]} />
											))
										}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="col-md-4">
							<ul className="pie-chart-statics">
								<li>{correct + wrong + empty} Soru</li>
								<li className="r-answer">{correct} Doğru</li>
								<li className="w-answer">{wrong} Yanlış</li>
								<li className="e-answer">{empty} Boş</li>
							</ul>
						</div>
						<div className="col-md-4">
							<ul className="sinav-time">
								<li>
									<div className="col s3 no-padding">Verilen Süre : </div>
									<div className="col s9">{examTime} dk</div>
								</li>
								<li>
									<div className="col s3 no-padding">Tamamlama Süresi : </div>
									<div className="col s9">{Math.round(elapsedTime / (1000 * 60))} dk</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ExamResult;

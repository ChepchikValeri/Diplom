function sinpoly(x, sinA, sinXC, sinW, linB, linA) {
	return (sinA * sin(Math.PI * (x - sinXC) / sinW)) + (linA + linB*x)
}
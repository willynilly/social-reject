# social-reject
A ball passing experiment to simulate social rejection.

## Instructions
```
npm install -g social-reject
social-reject
```
A JSON data file will be generated in the same directory.

## Options

```
social-reject -p 5 -r 10 -t .10 -d 2000
```

### -p
The number of players.
Default: 4
Minimum: 2

### -r
The number of rounds.
Default: 10
Minimum: 1

### -t
The probability that the user will receive the ball.
Default: .2
Minimum: 0
Maximum: 1

### -d
The maximum duration in milliseconds that a virtual player will wait to make a decision.
Default: 3000
Minimum: 200
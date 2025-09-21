class RockPaperScissorsGame {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameHistory = [];
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.playerScoreElement = document.getElementById('player-score');
        this.computerScoreElement = document.getElementById('computer-score');
        this.playerChoiceElement = document.getElementById('player-choice');
        this.computerChoiceElement = document.getElementById('computer-choice');
        this.resultElement = document.getElementById('result');
        this.choiceButtons = document.querySelectorAll('.choice-btn');
        this.resetButton = document.getElementById('reset-btn');
    }
    
    bindEvents() {
        this.choiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.playRound(choice);
            });
        });
        
        this.resetButton.addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    playRound(playerChoice) {
        // Disable buttons during the round
        this.disableButtons();
        
        // Show player choice immediately
        this.showChoice(this.playerChoiceElement, playerChoice);
        
        // Show computer choice with delay for suspense
        setTimeout(() => {
            const computerChoice = this.getComputerChoice();
            this.showChoice(this.computerChoiceElement, computerChoice);
            
            // Determine winner and update game state
            setTimeout(() => {
                const result = this.determineWinner(playerChoice, computerChoice);
                this.updateGameState(result, playerChoice, computerChoice);
                this.updateDisplay();
                this.enableButtons();
            }, 500);
        }, 800);
    }
    
    getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    }
    
    showChoice(element, choice) {
        const choiceEmojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        
        element.querySelector('.choice-text').textContent = choiceEmojis[choice];
        element.classList.add('reveal');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('reveal');
        }, 500);
    }
    
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        }
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }
    
    updateGameState(result, playerChoice, computerChoice) {
        // Update scores
        if (result === 'win') {
            this.playerScore++;
        } else if (result === 'lose') {
            this.computerScore++;
        }
        
        // Store game history
        this.gameHistory.push({
            playerChoice,
            computerChoice,
            result,
            timestamp: new Date()
        });
        
        // Update result display
        this.updateResultDisplay(result, playerChoice, computerChoice);
        
        // Highlight winner's choice
        this.highlightWinner(result);
    }
    
    updateResultDisplay(result, playerChoice, computerChoice) {
        const resultElement = this.resultElement;
        resultElement.className = `result ${result}`;
        
        let message = '';
        switch (result) {
            case 'win':
                message = `🎉 You win! ${this.getChoiceName(playerChoice)} beats ${this.getChoiceName(computerChoice)}!`;
                break;
            case 'lose':
                message = `😔 You lose! ${this.getChoiceName(computerChoice)} beats ${this.getChoiceName(playerChoice)}!`;
                break;
            case 'tie':
                message = `🤝 It's a tie! Both chose ${this.getChoiceName(playerChoice)}!`;
                break;
        }
        
        resultElement.querySelector('p').textContent = message;
    }
    
    getChoiceName(choice) {
        const names = {
            rock: 'Rock',
            paper: 'Paper',
            scissors: 'Scissors'
        };
        return names[choice];
    }
    
    highlightWinner(result) {
        // Remove previous winner highlights
        this.playerChoiceElement.classList.remove('winner');
        this.computerChoiceElement.classList.remove('winner');
        
        // Add winner highlight
        if (result === 'win') {
            this.playerChoiceElement.classList.add('winner');
        } else if (result === 'lose') {
            this.computerChoiceElement.classList.add('winner');
        }
        // For ties, no highlight is added
    }
    
    updateDisplay() {
        this.playerScoreElement.textContent = this.playerScore;
        this.computerScoreElement.textContent = this.computerScore;
        
        // Check for game end conditions
        if (this.playerScore >= 5 || this.computerScore >= 5) {
            this.endGame();
        }
    }
    
    endGame() {
        this.disableButtons();
        
        const winner = this.playerScore > this.computerScore ? 'player' : 'computer';
        const message = winner === 'player' 
            ? '🎊 Congratulations! You won the game!' 
            : '😢 Game Over! The computer won!';
        
        this.resultElement.className = `result ${winner === 'player' ? 'win' : 'lose'}`;
        this.resultElement.querySelector('p').textContent = message;
        
        // Show reset button prominently
        this.resetButton.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        this.resetButton.style.transform = 'scale(1.05)';
    }
    
    disableButtons() {
        this.choiceButtons.forEach(button => {
            button.disabled = true;
        });
    }
    
    enableButtons() {
        this.choiceButtons.forEach(button => {
            button.disabled = false;
        });
    }
    
    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameHistory = [];
        
        // Reset display
        this.playerChoiceElement.querySelector('.choice-text').textContent = '?';
        this.computerChoiceElement.querySelector('.choice-text').textContent = '?';
        
        // Remove winner highlights
        this.playerChoiceElement.classList.remove('winner');
        this.computerChoiceElement.classList.remove('winner');
        
        // Reset result display
        this.resultElement.className = 'result';
        this.resultElement.querySelector('p').textContent = 'Make your choice to start playing!';
        
        // Reset button styling
        this.resetButton.style.background = '#6c757d';
        this.resetButton.style.transform = 'none';
        
        this.updateDisplay();
        this.enableButtons();
    }
    
    // Utility method to get game statistics
    getGameStats() {
        const totalGames = this.gameHistory.length;
        const wins = this.gameHistory.filter(game => game.result === 'win').length;
        const losses = this.gameHistory.filter(game => game.result === 'lose').length;
        const ties = this.gameHistory.filter(game => game.result === 'tie').length;
        
        return {
            totalGames,
            wins,
            losses,
            ties,
            winRate: totalGames > 0 ? (wins / totalGames * 100).toFixed(1) : 0
        };
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new RockPaperScissorsGame();
    
    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            const rockButton = document.querySelector('[data-choice="rock"]');
            if (!rockButton.disabled) rockButton.click();
        } else if (e.key === 'p' || e.key === 'P') {
            const paperButton = document.querySelector('[data-choice="paper"]');
            if (!paperButton.disabled) paperButton.click();
        } else if (e.key === 's' || e.key === 'S') {
            const scissorsButton = document.querySelector('[data-choice="scissors"]');
            if (!scissorsButton.disabled) scissorsButton.click();
        } else if (e.key === 'Escape') {
            game.resetGame();
        }
    });
    
    // Add some fun animations and effects
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
});
